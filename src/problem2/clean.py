import json
from collections import defaultdict

# multiple entries of the same currency were listed on token info site
# function below detects duplicates and calculates the average price
# which is returned to a single entry while the others are removed

# this is not by any means an accurate method for handling
# data duplicates but primarily intended for dev purposes

def remove_duplicates(json_file):
    with open(json_file, "r") as file:
        # returns the json obj as dict
        data = json.load(file)

    token_data = defaultdict(list)
    # removes the data type date
    for item in data:
        del item["date"]
        token_data[item["currency"]].append(item["price"])

    for currency, prices in token_data.items():
        # calculates the avg price for duplicated entries
        if len(prices) > 1:
            average_price = sum(prices) / len(prices)
            # returns the avg price to the first entry of duplicated currencies
            for item in data:
                if item["currency"] == currency:
                    item["price"] = average_price
                    break
            # removes the duplicated entries
            data = [item for item in data if item["currency"] != currency or item["price"] == average_price]

    # writes data back to file
    with open(json_file, "w") as file:
        json.dump(data, file, indent=2)

remove_duplicates("token.json")