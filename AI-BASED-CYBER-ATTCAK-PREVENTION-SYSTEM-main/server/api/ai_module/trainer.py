import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score

# 1. Define all 43 column names for NSL-KDD
columns = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes", "land", 
    "wrong_fragment", "urgent", "hot", "num_failed_logins", "logged_in", "num_compromised", 
    "root_shell", "su_attempted", "num_root", "num_file_creations", "num_shells", 
    "num_access_files", "num_outbound_cmds", "is_host_login", "is_guest_login", "count", 
    "srv_count", "serror_rate", "srv_serror_rate", "rerror_rate", "srv_rerror_rate", 
    "same_srv_rate", "diff_srv_rate", "srv_diff_host_rate", "dst_host_count", 
    "dst_host_srv_count", "dst_host_same_srv_rate", "dst_host_diff_srv_rate", 
    "dst_host_same_src_port_rate", "dst_host_srv_diff_host_rate", "dst_host_serror_rate", 
    "dst_host_srv_serror_rate", "dst_host_rerror_rate", "dst_host_srv_rerror_rate", 
    "label", "difficulty_score"
]

# 2. Load the .txt files
print("Loading datasets...")
train_df = pd.read_csv('server/api/ai_module/KDDTrain+.txt', names=columns)
test_df = pd.read_csv('server\api\ai_module\KDDTest+.txt', names=columns)

# 3. Drop the 'difficulty_score' (it's not useful for real-time prevention)
train_df.drop('difficulty_score', axis=1, inplace=True)
test_df.drop('difficulty_score', axis=1, inplace=True)

# 4. Encode Categorical Data (protocol_type, service, flag)
# AI models need numbers, not words like 'tcp' or 'http'
le = LabelEncoder()
categorical_cols = ['protocol_type', 'service', 'flag']

for col in categorical_cols:
    train_df[col] = le.fit_transform(train_df[col])
    # Use 'transform' for test data to keep the numbering consistent
    test_df[col] = le.fit_transform(test_df[col]) 

# 5. Split Features (X) and Labels (y)
X_train = train_df.drop('label', axis=1)
y_train = train_df['label']

# Simplify labels: 'normal' becomes 0, everything else (attacks) becomes 1
y_train = y_train.apply(lambda x: 0 if x == 'normal' else 1)
y_test = test_df['label'].apply(lambda x: 0 if x == 'normal' else 1)
X_test = test_df.drop('label', axis=1)

# 6. Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 7. Train the Model
print("Training AI Model (this may take a minute)...")
model = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
model.fit(X_train_scaled, y_train)

# 8. Check Accuracy
y_pred = model.predict(X_test_scaled)
print(f"Final Accuracy Score: {accuracy_score(y_test, y_pred) * 100:.2f}%")

# 9. Save files
joblib.dump(model, 'cyber_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("Model and Scaler saved!")