
import pandas as pd
import requests

# Helper function to replace NaN with None and convert everything to string
def clean_value(val):
    if pd.isna(val):
        return None
    if isinstance(val, float):
        if val != val or val in [float('inf'), float('-inf')]:
            return None
    return str(val).strip()

# Load CSV
csv_path = input("Enter your CSV file name: ")
if not csv_path.endswith(".csv"):
    csv_path += ".csv"

# Force postal code and all columns to string (object) on read, to avoid float issues
data = pd.read_csv(csv_path, dtype=str).where(pd.notnull(pd.read_csv(csv_path, dtype=str)), None)

# Paddle API setup
API_KEY = "pdl_sdbx_apikey_01jyrhspvqzh68nh20ry8m1r3m_m8rp9Kd7QNaGY6cvR7kvvR_Anr"
API_URL = "https://sandbox-api.paddle.com"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

for _, row in data.iterrows():
    # 1. Create customer
    customer_payload = {
        "email": clean_value(row['customer_email']),
        "name": clean_value(row['customer_full_name']),
        "custom_data": {
            "external_id": clean_value(row['customer_external_id'])
        } if clean_value(row.get('customer_external_id')) else None
    }

    response = requests.post(f"{API_URL}/customers", headers=HEADERS, json=customer_payload)
    if response.status_code != 201:
        print(f"❌ Failed to create customer {row['customer_email']}: {response.text}")
        continue

    customer_id = response.json()['data']['id']
    print(f"✅ Created customer {customer_id} for {row['customer_email']}")

    # 2. Create address if country_code and first_line are present
    if clean_value(row.get('address_country_code')) and clean_value(row.get('address_street_line1')):
        address_payload = {
            "country_code": clean_value(row['address_country_code']),
            "first_line": clean_value(row['address_street_line1']),
            "second_line": clean_value(row.get('address_street_line2')),
            "city": clean_value(row.get('address_city')),
            "region": clean_value(row.get('address_region')),
            "postal_code": clean_value(row.get('address_postal_code')),
            "custom_data": {
                "external_id": clean_value(row['address_external_id'])
            } if clean_value(row.get('address_external_id')) else None
        }

        response = requests.post(f"{API_URL}/customers/{customer_id}/addresses", headers=HEADERS, json=address_payload)
        if response.status_code != 201:
            print(f"❌ Failed to create address for {row['customer_email']}: {response.text}")
        else:
            print(f"✅ Created address for customer {customer_id}")

    # 3. Create business if business_name is present
    if clean_value(row.get('business_name')):
        business_payload = {
            "name": clean_value(row['business_name']),
            "company_number": clean_value(row.get('business_company_number')),
            "tax_identifier": clean_value(row.get('business_tax_identifier')),
            "custom_data": {
                "external_id": clean_value(row['business_external_id'])
            } if clean_value(row.get('business_external_id')) else None
        }

        response = requests.post(f"{API_URL}/customers/{customer_id}/businesses", headers=HEADERS, json=business_payload)
        if response.status_code != 201:
            print(f"❌ Failed to create business for {row['customer_email']}: {response.text}")
        else:
            print(f"✅ Created business for customer {customer_id}")

print("🎉 All records processed.")
