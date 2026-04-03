from fastapi import FastAPI
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

app = FastAPI()

model = None
scaler = MinMaxScaler()


def train_model(prices):

    global model

    prices = np.array(prices).reshape(-1, 1)

    scaled = scaler.fit_transform(prices)

    X = []
    y = []

    window = 10

    for i in range(window, len(scaled)):
        X.append(scaled[i-window:i])
        y.append(scaled[i])

    X = np.array(X)
    y = np.array(y)

    model = Sequential()
    model.add(LSTM(32, input_shape=(window,1)))
    model.add(Dense(1))

    model.compile(optimizer='adam', loss='mse')

    model.fit(X, y, epochs=5, verbose=0)


def predict_next(prices):

    prices = np.array(prices).reshape(-1,1)

    scaled = scaler.transform(prices)

    last_window = scaled[-10:]

    last_window = last_window.reshape(1,10,1)

    pred = model.predict(last_window)

    predicted_price = scaler.inverse_transform(pred)

    return float(predicted_price[0][0])


@app.post("/predict")
def predict_price(data: dict):

    prices = list(reversed(data["prices"]))

    if len(prices) < 20:
        return {
            "current_price": prices[-1],
            "predicted_price": prices[-1]
        }

    train_model(prices)

    predicted_price = predict_next(prices)

    return {
        "current_price": prices[-1],
        "predicted_price": predicted_price
    }