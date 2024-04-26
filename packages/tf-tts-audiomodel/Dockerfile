FROM python:3.7
WORKDIR /app
COPY requirements.txt requirements.txt
COPY . .
# TensorFlowTTS==1.8 num2words==0.5.13 keras==2.6
RUN pip install -r requirements.txt
RUN python main.py
RUN cd /app
