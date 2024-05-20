from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
import sqlite3
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import LeakyReLU


app = Flask(__name__)

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
conn.close()

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

# Load the model with custom objects
model_combined = load_model('/workspaces/final-project/your_model.h5', custom_objects={'LeakyReLU': LeakyReLU})

loss = model_combined.evaluate(X_test, y_test)
print(f'Test Loss: {loss}')

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


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')

    if not start_date or not end_date:
        return redirect(url_for('index'))

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        start_date = start_date.replace(hour=0, minute=0, second=0)

        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        end_date = end_date.replace(hour=23, minute=59, second=59)
        print(start_date, end_date)
    except ValueError:
        return redirect(url_for('index'))

    # Call your ML model's prediction method here
    prediction = predict_future(start_date, end_date, scaled_features, model_combined, scaler)
    prediction = prediction[['date'] + [col for col in prediction.columns if col != 'date']]
    prediction_html = prediction.to_html(index=False, classes='table table-striped table-bordered table-hover')
    return render_template('results.html', prediction_html=prediction_html)

if __name__ == '__main__':
    app.run(debug=True, port=3002)
