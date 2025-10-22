from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import hmac
import hashlib
import base64
import jwt
from boto3.dynamodb.conditions import Key

app = Flask(__name__)
CORS(app)

# ---------------- AWS Cognito Setup ----------------
region = "ap-south-1"
USER_POOL_ID = "ap-south-1_gP8lDIRTn"
CLIENT_ID = "12bpkc6d4i8cpe5pm1rvc79suj"
CLIENT_SECRET = "scmhbpe2knee6llr0su450nm04rl722uvgkir53nao6055fthpn"

cognito_client = boto3.client("cognito-idp", region_name=region)

# ---------------- DynamoDB Setup ----------------
dynamodb = boto3.resource("dynamodb", region_name=region)
tickets_table = dynamodb.Table("Tickets")

# ---------------- Helper to calculate SECRET_HASH ----------------
def get_secret_hash(username):
    message = username + CLIENT_ID
    dig = hmac.new(
        str(CLIENT_SECRET).encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    return base64.b64encode(dig).decode()

# ---------------- Signup ----------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username", data["email"].replace("@", "_").replace(".", "_"))

    try:
        cognito_client.sign_up(
            ClientId=CLIENT_ID,
            SecretHash=get_secret_hash(username),
            Username=username,
            Password=data["password"],
            UserAttributes=[
                {"Name": "name", "Value": data["name"]},
                {"Name": "email", "Value": data["email"]}
            ]
        )
        cognito_client.admin_confirm_sign_up(
            UserPoolId=USER_POOL_ID,
            Username=username
        )
        return jsonify({"message": "User signed up and confirmed successfully"}), 200
    except cognito_client.exceptions.UsernameExistsException:
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# ---------------- Login ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username", data["email"].replace("@", "_").replace(".", "_"))

    try:
        resp = cognito_client.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": data["password"],
                "SECRET_HASH": get_secret_hash(username)
            }
        )
        return jsonify({
            "message": "Login successful",
            "token": resp["AuthenticationResult"]["IdToken"]
        })
    except Exception as e:
        return jsonify({"message": str(e)}), 401

# ---------------- Get Tickets ----------------
@app.route("/api/tickets", methods=["GET"])
def get_tickets():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"message": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]  # get token after 'Bearer '
    try:
        # Decode without signature verification for testing
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get("cognito:username")  # use Cognito username
        if not username:
            return jsonify({"message": "Invalid token"}), 401

        # Query DynamoDB
        response = tickets_table.query(
            KeyConditionExpression=Key("username").eq(username)
        )
        tickets = response.get("Items", [])
        return jsonify({"tickets": tickets})

    except Exception as e:
        print("Error in /api/tickets:", e)
        return jsonify({"message": str(e)}), 500


# ---------------- Run App ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
