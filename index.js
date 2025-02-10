{
  "nbformat": 4,
  "nbformat_minor": 0,
  "metadata": {
    "colab": {
      "provenance": [],
      "authorship_tag": "ABX9TyMPRoj4LnsWIzLgrnAheIi9",
      "include_colab_link": true
    },
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3"
    },
    "language_info": {
      "name": "python"
    }
  },
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "view-in-github",
        "colab_type": "text"
      },
      "source": [
        "<a href=\"https://colab.research.google.com/github/Aditya5529/RPM-Vitals-Collection--Healthcare-Platform-Application/blob/main/index.js\" target=\"_parent\"><img src=\"https://colab.research.google.com/assets/colab-badge.svg\" alt=\"Open In Colab\"/></a>"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": 3,
      "metadata": {
        "colab": {
          "base_uri": "https://localhost:8080/",
          "height": 106
        },
        "id": "zLXkXpLit9Cj",
        "outputId": "8770ceb0-05ed-4977-8542-81fa12eb5da1"
      },
      "outputs": [
        {
          "output_type": "error",
          "ename": "SyntaxError",
          "evalue": "invalid syntax (<ipython-input-3-6f75dd99741a>, line 1)",
          "traceback": [
            "\u001b[0;36m  File \u001b[0;32m\"<ipython-input-3-6f75dd99741a>\"\u001b[0;36m, line \u001b[0;32m1\u001b[0m\n\u001b[0;31m    const functions = require(\"firebase-functions\");\u001b[0m\n\u001b[0m          ^\u001b[0m\n\u001b[0;31mSyntaxError\u001b[0m\u001b[0;31m:\u001b[0m invalid syntax\n"
          ]
        }
      ],
      "source": [
        "const functions = require(\"firebase-functions\");\n",
        "const admin = require(\"firebase-admin\");\n",
        "\n",
        "admin.initializeApp();\n",
        "const db = admin.firestore();\n",
        "\n",
        "exports.monitorVitals = functions.firestore\n",
        "    .document(\"users/{userId}/vitals/{vitalId}\")\n",
        "    .onCreate(async (snapshot, context) => {\n",
        "        const vitalData = snapshot.data();\n",
        "        const userId = context.params.userId;\n",
        "\n",
        "        let alerts = [];\n",
        "\n",
        "        if (vitalData.blood_sugar > 180 || vitalData.blood_sugar < 60) {\n",
        "            alerts.push(\"Critical Blood Sugar Level Detected!\");\n",
        "        }\n",
        "        if (vitalData.SpO2 < 90) {\n",
        "            alerts.push(\"Low Oxygen Level Detected!\");\n",
        "        }\n",
        "        if (vitalData.pulse_rate > 120 || vitalData.pulse_rate < 50) {\n",
        "            alerts.push(\"Abnormal Pulse Rate Detected!\");\n",
        "        }\n",
        "        if (vitalData.heart_rate > 120 || vitalData.heart_rate < 50) {\n",
        "            alerts.push(\"Abnormal Heart Rate Detected!\");\n",
        "        }\n",
        "        if (vitalData.blood_pressure) {\n",
        "            const [systolic, diastolic] = vitalData.blood_pressure.split(\"/\").map(Number);\n",
        "            if (systolic > 140 || diastolic > 90) {\n",
        "                alerts.push(\"High Blood Pressure Detected!\");\n",
        "            }\n",
        "        }\n",
        "\n",
        "        if (alerts.length > 0) {\n",
        "            await db.collection(\"users\").doc(userId).collection(\"alerts\").add({\n",
        "                alerts: alerts,\n",
        "                timestamp: admin.firestore.FieldValue.serverTimestamp(),\n",
        "            });\n",
        "\n",
        "            console.log(`Alerts generated for user ${userId}:`, alerts);\n",
        "        }\n",
        "    });\n"
      ]
    }
  ]
}