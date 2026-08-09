import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from apps.core.models import SiteConfiguration

def generate_pdf_document(document_type, document_number, client_info, line_items, summary_totals, notes=""):
    """
    Generates a professional PDF document (Quotation or Invoice) using ReportLab with company letterhead.
    
    :param document_type: 'QUOTATION' or 'INVOICE'
    :param document_number: e.g., 'Q-2026-001' or 'ORD-2026-101'
    :param client_info: dict with client_name, client_email, client_phone, company_name, address
    :param line_items: list of dicts [{'name': '...', 'description': '...', 'qty': 1, 'unit_price': 100, 'total': 100}]
    :param summary_totals: dict with subtotal, tax_amount, discount_amount, grand_total
    :param notes: additional terms or scope notes
    :return: BytesIO buffer containing the generated PDF
    """
    site_config = SiteConfiguration.objects.first()
    currency = site_config.currency_symbol if site_config else "$"
    company_name = site_config.site_name if site_config else "NewInfrizo"
    company_address = site_config.address if site_config else "Dhaka, Bangladesh"
    company_email = site_config.contact_email if site_config else "contact@newinfrizo.com"
    company_phone = site_config.contact_phone if site_config else "+8801700000000"
    company_tax_id = site_config.company_tax_id if site_config else ""
    bank_details = site_config.bank_details if site_config else ""
    footer_text = site_config.letterhead_footer_text if site_config else "Thank you for choosing NewInfrizo. Computer generated document."

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#252f40')
    )
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#344767')
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#67748e')
    )
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    elements = []

    # 1. Header Row (Company Info & Letterhead Logo + Document Title)
    header_data = [
        [
            Paragraph(f"<b>{company_name}</b><br/>{company_address}<br/>Email: {company_email}<br/>Phone: {company_phone}" + (f"<br/>Tax ID: {company_tax_id}" if company_tax_id else ""), body_style),
            Paragraph(f"<b>{document_type}</b><br/><font color='#7b809a'>#{document_number}</font>", title_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[3.5*inch, 3.5*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e9ecef'), spaceAfter=15))

    # 2. Client & Document Info Section
    client_text = f"<b>Billed To:</b><br/>"
    if client_info.get('company_name'):
        client_text += f"<b>{client_info.get('company_name')}</b><br/>"
    client_text += f"{client_info.get('client_name', 'Client')}<br/>"
    if client_info.get('client_email'):
        client_text += f"Email: {client_info.get('client_email')}<br/>"
    if client_info.get('client_phone'):
        client_text += f"Phone: {client_info.get('client_phone')}<br/>"
    if client_info.get('address'):
        client_text += f"{client_info.get('address')}"

    meta_text = f"<b>Date:</b> {client_info.get('date', 'N/A')}<br/>"
    if client_info.get('deadline_or_due'):
        meta_text += f"<b>Valid Until / Due:</b> {client_info.get('deadline_or_due')}<br/>"
    if client_info.get('status'):
        meta_text += f"<b>Status:</b> {client_info.get('status').upper()}"

    info_data = [
        [Paragraph(client_text, body_style), Paragraph(meta_text, body_style)]
    ]
    info_table = Table(info_data, colWidths=[4.5*inch, 2.5*inch])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fa')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 15))

    # 3. Line Items Table
    table_data = [
        [
            Paragraph("Item & Description", table_header_style),
            Paragraph("Qty", table_header_style),
            Paragraph(f"Unit Price ({currency})", table_header_style),
            Paragraph(f"Total ({currency})", table_header_style)
        ]
    ]

    for item in line_items:
        item_desc = f"<b>{item.get('name', 'Item')}</b>"
        if item.get('description'):
            item_desc += f"<br/><font color='#67748e'>{item.get('description')}</font>"
        
        table_data.append([
            Paragraph(item_desc, body_style),
            Paragraph(str(item.get('qty', 1)), body_style),
            Paragraph(f"{currency} {item.get('unit_price', 0):,.2f}", body_style),
            Paragraph(f"{currency} {item.get('total', 0):,.2f}", body_style)
        ])

    items_table = Table(table_data, colWidths=[4.0*inch, 0.8*inch, 1.1*inch, 1.1*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#344767')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e9ecef')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 15))

    # 4. Totals Summary Table
    subtotal = summary_totals.get('subtotal', 0)
    tax = summary_totals.get('tax_amount', 0)
    discount = summary_totals.get('discount_amount', 0)
    grand_total = summary_totals.get('grand_total', subtotal + tax - discount)

    totals_data = [
        [Paragraph("<b>Subtotal:</b>", body_style), Paragraph(f"{currency} {subtotal:,.2f}", body_style)],
    ]
    if tax > 0:
        totals_data.append([Paragraph("<b>Tax / VAT:</b>", body_style), Paragraph(f"{currency} {tax:,.2f}", body_style)])
    if discount > 0:
        totals_data.append([Paragraph("<b>Discount:</b>", body_style), Paragraph(f"- {currency} {discount:,.2f}", body_style)])
    totals_data.append([Paragraph("<b>Grand Total:</b>", h2_style), Paragraph(f"<b>{currency} {grand_total:,.2f}</b>", h2_style)])

    totals_table = Table(totals_data, colWidths=[2.0*inch, 1.5*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    
    # Position summary table on right side
    summary_wrapper = Table([[Paragraph("", body_style), totals_table]], colWidths=[3.5*inch, 3.5*inch])
    summary_wrapper.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(summary_wrapper)
    elements.append(Spacer(1, 20))

    # 5. Notes & Bank Details
    if notes or bank_details:
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e9ecef'), spaceAfter=10))
        if notes:
            elements.append(Paragraph(f"<b>Terms & Notes:</b><br/>{notes}", body_style))
            elements.append(Spacer(1, 8))
        if bank_details:
            elements.append(Paragraph(f"<b>Bank Payment Info:</b><br/>{bank_details}", body_style))

    # 6. Footer Text
    elements.append(Spacer(1, 25))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e9ecef'), spaceAfter=10))
    elements.append(Paragraph(f"<center>{footer_text}</center>", body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer
