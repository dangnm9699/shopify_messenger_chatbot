# Messenger Chatbot Analyzer

Heroku deploy:

```bash
git subtree push --prefix messenger_chat_dashboard heroku master
```

**Prerequisites**

- Python 3.8.x
- Ubuntu 20.04

## 1. Setup environtment

- Create venv

```bash
python -m venv .venv
```

- Activate venv

```bash
source ./.venv/bin/activate
```

- Install packages

```bash
pip install -r requirements.txt
```

## 2. How to run

```bash
uvicorn main:app --reload
```
