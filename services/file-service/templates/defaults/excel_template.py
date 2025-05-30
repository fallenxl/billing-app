import pandas as pd
def create_default_excel(data, filename):


    # Create a DataFrame from the data
    df = pd.DataFrame(data)

    # Save the DataFrame to an Excel file
    df.to_excel(f"../../storage/{filename}.xlsx", index=False)