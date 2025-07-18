from datetime import datetime, timedelta
import pandas as pd

welcome = '''
Paddle Billing PRODUCTION Script

This script assumes you have a CSV mapping file from TokenEx to map against. 

PLEASE ENSURE ALL COLUMNS HEADERS HAVE NO HIDDEN WHITE SPACES

'''

print(welcome)

# grab subscriber data file
subscribeinput = str(input("Enter the name of your Subscriber export file: "))
if not ".csv" in subscribeinput:
  subscribeinputfull  =subscribeinput + ".csv"

subscribedata = pd.read_csv(subscribeinputfull,
                  parse_dates=['current_period_started_at'],
                  dtype={'postal_code':object},
                  keep_default_na=False, na_values=['_'] # keep country code NA for Namibia
)

subscribedata = subscribedata.rename(columns={'card_token': 'card_id'})

print(subscribedata)

# grab mapping file
mappinginput = str(input("Enter the name of your TokenEx mapping file: "))
if not ".csv" in mappinginput:
  mappinginputfull = mappinginput + ".csv"

mappingdata = pd.read_csv(mappinginputfull, encoding='latin-1')

mappingdata = mappingdata.rename(columns={'card.id': 'card_id'})
mappingdata = mappingdata.rename(columns={'card.transaction_ids': 'network_transaction_id'})

# merge the two datasets
finaljoin = pd.merge(mappingdata,
                    subscribedata,
                    left_on='card_id', 
                    right_on='card_id', 
                    how='outer')

finaljoin = finaljoin[finaljoin['card_id'].notna()]

# rename columns as required
completed = finaljoin.rename(columns={
    'card.number': 'card_token',
    'card.name': 'card_holder_name',
    'card.exp_month': 'card_expiry_month',
    'card.exp_year': 'card_expiry_year',
})

completed['card_holder_name'] = completed['card_holder_name'].fillna(completed['customer_full_name'])

# remove unnecessary columns
columns_to_remove = [
    'card_address_line1',
    'card_address_line2',
    'card_address_city',
    'card_address_state',
    'card_address_zip',
    'card_address_country',
    'default_source',
    'email',
    'id',
    'card.address_zip', 
    'card.address_state', 
    'card.address_line2', 
    'card.address_line1', 
    'card.address_country', 
    'card.address_city', 
    'name', 
    'description'
]

columns_to_remove = [col for col in columns_to_remove if col in completed.columns]

completed = completed.drop(columns=columns_to_remove)

completed = completed[completed['customer_email'].notna()]

# Reformat 'current_period_started_at' to desired format
completed['current_period_started_at'] = completed['current_period_started_at'].dt.strftime('%Y-%m-%dT%H:%M:%SZ')

# Add vault_provider column
completed['vault_provider'] = vault_provider

# Check if 'enable_checkout' exists in the dataframe and convert to upper case if it does
if 'enable_checkout' in completed.columns:
    completed['enable_checkout'] = completed['enable_checkout'].apply(lambda x: str(x).upper() if pd.notnull(x) else x)

success = completed[completed['card_token'].notna()]
no_tokens = completed[completed['card_token'].isnull()]
# Find all rows where card_token (encrypted card number) appears more than once
duplicate_tokens = completed[completed['card_token'].notna() & completed.duplicated(subset='card_token', keep=False)]
# Find all rows where card_id (pm_*) appears more than once
duplicate_card_ids = completed[completed['card_id'].notna() & completed.duplicated(subset='card_id', keep=False)]
# Find all rows where external_subscription_id appears more than once
duplicate_external_subscription_ids = completed[completed.duplicated(subset='subscription_external_id', keep=False)]
# Find all rows where emails appears more than once
duplicate_emails = completed[completed.duplicated(subset='customer_email', keep=False)]

success.to_csv(f'{subscribeinput}_final_import.csv', index=False, float_format='%.0f')
no_tokens.to_csv(f'{subscribeinput}_no_token_found.csv', index=False, float_format='%.0f')
duplicate_tokens.to_csv(f'{subscribeinput}_duplicate_tokens.csv', index=False, float_format='%.0f')
duplicate_card_ids.to_csv(f'{subscribeinput}_duplicate_card_ids.csv', index=False, float_format='%.0f')
duplicate_external_subscription_ids.to_csv(f'{subscribeinput}_duplicate_external_subscription_ids.csv', index=False, float_format='%.0f') 
duplicate_emails.to_csv(f'{subscribeinput}_duplicate_emails.csv', index=False, float_format='%.0f') 


print('Success')