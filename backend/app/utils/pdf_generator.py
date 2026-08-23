from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm

import os
from datetime import datetime


def generate_pdf(data, detection_rows, filename):

    # Create reports directory
    os.makedirs("reports", exist_ok=True)

    # Unique PDF filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    file_path = os.path.join(
        "reports",
        f"{filename}_{timestamp}.pdf"
    )


    # Create PDF
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )


    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    title_style.alignment = TA_CENTER

    normal = styles["Normal"]

    story = []


    # ==========================================
    # TITLE
    # ==========================================

    story.append(
        Paragraph(
            "SentinelAI Pro Detection Report",
            title_style
        )
    )

    story.append(Spacer(1, 20))


    # ==========================================
    # REPORT INFORMATION
    # ==========================================

    for key, value in data.items():

        story.append(
            Paragraph(
                f"<b>{key}:</b> {value}",
                normal
            )
        )

        story.append(Spacer(1, 6))


    story.append(Spacer(1, 20))


    # ==========================================
    # DETECTION HISTORY
    # ==========================================

    story.append(
        Paragraph(
            "Detection History",
            styles["Heading2"]
        )
    )

    story.append(Spacer(1, 10))


    table_data = [
        [
            "ID",
            "Filename",
            "Prediction",
            "Confidence"
        ]
    ]


    # Add actual database records
    for row in detection_rows:

        confidence = row["confidence"]

        if confidence is not None:

            confidence_text = (
                f"{float(confidence) * 100:.2f}%"
            )

        else:

            confidence_text = "-"


        table_data.append(
            [
                str(row["id"]),
                str(row["filename"]),
                str(row["prediction"]),
                confidence_text
            ]
        )


    # No records
    if len(detection_rows) == 0:

        table_data.append(
            [
                "-",
                "No detection records",
                "-",
                "-"
            ]
        )


    # ==========================================
    # TABLE
    # ==========================================

    table = Table(
        table_data,
        colWidths=[
            15 * mm,
            65 * mm,
            55 * mm,
            30 * mm
        ]
    )


    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.darkblue
                ),

                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),

                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),

                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8
                ),

                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE"
                ),

                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    5
                ),

                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    5
                )
            ]
        )
    )


    story.append(table)

    story.append(Spacer(1, 20))


    # ==========================================
    # FOOTER
    # ==========================================

    story.append(
        Paragraph(
            "Generated automatically by SentinelAI Pro.",
            normal
        )
    )


    # Build PDF
    doc.build(story)


    print("PDF CREATED:", file_path)

    return file_path