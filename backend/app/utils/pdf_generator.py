import os

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(data, filename):

    # Create reports folder automatically
    os.makedirs("reports", exist_ok=True)

    path = os.path.join("reports", f"{filename}.pdf")

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(
        path,
        pagesize=letter
    )

    content = []

    content.append(
        Paragraph(
            "SentinelAI Pro Detection Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 20))

    for key, value in data.items():

        content.append(
            Paragraph(
                f"<b>{key}</b>: {value}",
                styles["Normal"]
            )
        )

        content.append(Spacer(1, 10))

    doc.build(content)

    return path