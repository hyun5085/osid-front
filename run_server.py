#!/usr/bin/env python3
import os
import sys
from main import app

if __name__ == '__main__':
    # Run on port 80 to match external port mapping
    app.run(host='0.0.0.0', port=80, debug=False)