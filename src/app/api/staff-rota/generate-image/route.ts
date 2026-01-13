import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { db } from '@/libs/DB';
import { staffRota } from '@/models/Schema';

export async function GET() {
  try {
    // Fetch staff rota data
    const rotaData = await db.select().from(staffRota);

    // Generate HTML for the table
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 16px;
              padding: 32px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 {
              margin: 0 0 24px 0;
              font-size: 32px;
              color: #1a202c;
              text-align: center;
            }
            .subtitle {
              text-align: center;
              color: #718096;
              margin-bottom: 32px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
            }
            thead {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            th {
              padding: 16px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
              color: #2d3748;
            }
            tbody tr:hover {
              background: #f7fafc;
            }
            .employee-name {
              font-weight: 600;
              color: #2d3748;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
            }
            .status-scheduled {
              background: #fef3c7;
              color: #92400e;
            }
            .status-confirmed {
              background: #d1fae5;
              color: #065f46;
            }
            .status-pending {
              background: #dbeafe;
              color: #1e3a8a;
            }
            .status-cancelled {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              margin-top: 24px;
              text-align: center;
              color: #a0aec0;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📅 Staff Rota Schedule</h1>
            <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</div>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Shift Time</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rotaData.map(row => `
                  <tr>
                    <td class="employee-name">${row.employeeName}</td>
                    <td>${row.position}</td>
                    <td>${new Date(row.shiftDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>${row.startTime} - ${row.endTime}</td>
                    <td>${row.location || '-'}</td>
                    <td>
                      <span class="status status-${row.status.toLowerCase()}">${row.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              📱 Shared via WhatsApp • DataTable Management System
            </div>
          </div>
        </body>
      </html>
    `;

    // Launch puppeteer and capture screenshot
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(html);

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    });

    await browser.close();

    // Return image as response
    // eslint-disable-next-line node/prefer-global/buffer
    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="staff-rota.png"',
      },
    });
  } catch (error) {
    console.error('Error generating staff rota image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
