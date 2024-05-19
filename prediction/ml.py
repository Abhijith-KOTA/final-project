
import sqlite3
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, LSTM, Dense, Dropout, Flatten, Bidirectional, LeakyReLU

conn = sqlite3.connect('/workspaces/final-project/backend/airPollution.db')
query = """
        SELECT 
            time AS 'Timestamp',
            pm2_5 AS 'dust(mg_m^3)',
            CO AS 'CO(mg_m^3)',
            NH3 AS 'NH3(ug_m^3)',
            Ozone AS 'O3(ppm)',
            humidity AS 'humidity',
            Temperature AS 'temperature'
        FROM 
            air_quality;
        """
df = pd.read_sql(query, conn)

print(df.head(5))

df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df.set_index('Timestamp', inplace=True)

features = df[['dust(mg_m^3)', 'CO(mg_m^3)', 'NH3(ug_m^3)', 'O3(ppm)', 'humidity', 'temperature']]
target_features = ['dust(mg_m^3)', 'CO(mg_m^3)', 'NH3(ug_m^3)', 'O3(ppm)']

scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(features)


def create_sequences(data, target_columns, sequence_length=60):
    sequences = []
    targets = []
    for i in range(len(data) - sequence_length):
        seq = data[i:i+sequence_length]
        target = data[i+sequence_length, target_columns]
        sequences.append(seq)
        targets.append(target)
    return np.array(sequences), np.array(targets)

sequence_length = 60
X, y = create_sequences(scaled_features, target_columns=[0, 1, 2, 3], sequence_length=sequence_length)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)


model_combined = Sequential()
model_combined.add(Bidirectional(LSTM(100, return_sequences=True), input_shape=(X_train.shape[1], X_train.shape[2])))
model_combined.add(Dropout(0.5))
model_combined.add(Conv1D(filters=128, kernel_size=2, activation=LeakyReLU(alpha=0.7)))
model_combined.add(MaxPooling1D(pool_size=1))
model_combined.add(Dropout(0.5))
model_combined.add(LSTM(100, return_sequences=True))
model_combined.add(Dropout(0.3))
model_combined.add(LSTM(100, return_sequences=False))
model_combined.add(Dropout(0.3))
model_combined.add(Flatten())
model_combined.add(Dense(50, activation='relu'))
model_combined.add(Dense(y_train.shape[1]))

model_combined.compile(optimizer='adam', loss='mean_squared_error')


history = model_combined.fit(X_train, y_train, epochs=100, batch_size=32, validation_data=(X_test, y_test))

def predict_future(start_date, end_date, initial_data, model, scaler, sequence_length=60):

    future_dates = pd.date_range(start=start_date, end=end_date, freq='H')


    initial_data = initial_data[-sequence_length:].copy()

    future_predictions = []

    for date in future_dates:
        scaled_data = scaler.transform(initial_data)
        input_sequence = np.array(scaled_data).reshape(1, sequence_length, -1)
        predicted_values = model.predict(input_sequence)[0]
        future_predictions.append(predicted_values)

        new_row = np.concatenate([predicted_values, initial_data[-1, 4:]])
        initial_data = np.vstack([initial_data[1:], new_row])


    future_predictions = np.array(future_predictions)
    future_predictions = scaler.inverse_transform(
        np.concatenate([future_predictions, np.zeros((future_predictions.shape[0], 2))], axis=1)
    )[:, :4]

    future_df = pd.DataFrame(future_predictions, columns=target_features)
    future_df['date'] = future_dates
    return future_df


start_date = input("Enter the start date and time (YYYY-MM-DD HH:MM:SS): ")
end_date = input("Enter the end date and time (YYYY-MM-DD HH:MM:SS): ")


try:
    pd.to_datetime(start_date)
    pd.to_datetime(end_date)
except ValueError:
    print("Invalid date format. Please enter the date in YYYY-MM-DD HH:MM:SS format.")

future_predictions = predict_future(start_date, end_date, scaled_features, model_combined, scaler)

print(future_predictions.to_string(index=False))
