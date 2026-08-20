import firebase_admin
from firebase_admin import credentials, firestore, messaging
import time
import os
import json

# Load credentials from GitHub Secret
service_account_info = json.loads(os.environ.get('FIREBASE_SERVICE_ACCOUNT'))
cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred)

db = firestore.client()

def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
    )
    try:
        messaging.send(message)
        print(f"Sent message to {token}")
    except Exception as e:
        print(f"Error: {e}")

def check_communities():
    communities_ref = db.collection('communities')
    docs = communities_ref.stream()

    current_time_ms = int(time.time() * 1000)
    # Awa 2 (2 hours)
    TWO_HOURS_MS = 7200000 
    # Lokacin da aka diba (24 hours)
    DEADLINE_MS = 86400000 

    for doc in docs:
        community = doc.to_dict()
        # Muna duba "joinTimes" dinda muka saka a Android
        join_times = community.get('joinTimes', {}) 
        
        for app_id, join_time in join_times.items():
            time_elapsed = current_time_ms - join_time
            time_remaining = DEADLINE_MS - time_elapsed

            # Idan lokaci ya rage kasa da awa 2
            if 0 < time_remaining < TWO_HOURS_MS:
                app_doc = db.collection('apps').document(app_id).get()
                if app_doc.exists:
                    dev_email = app_doc.to_dict().get('developerEmail')
                    # Nemo mai app din domin samun FCM Token dinsa
                    user_query = db.collection('users').where('email', '==', dev_email).limit(1).stream()
                    for user in user_query:
                        fcm_token = user.to_dict().get('fcmToken')
                        if fcm_token:
                            send_push_notification(
                                fcm_token, 
                                "12 TESTERS: Time is running out!", 
                                f"You have less than 2 hours to install all member apps in {community.get('name')}!"
                            )

if __name__ == "__main__":
    check_communities()
