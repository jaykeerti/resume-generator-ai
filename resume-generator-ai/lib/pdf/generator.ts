import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import type { Resume } from '@/lib/types/resume'

interface PDFGenerationOptions {
  resume: Resume
  addWatermark: boolean
}

export async function generateResumePDF({ resume, addWatermark }: PDFGenerationOptions): Promise<Buffer> {
  let browser = null

  try {
    console.log('Starting PDF generation for resume:', resume.id)

    // Launch headless Chrome
    console.log('Launching browser...')
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    console.log('Browser launched, creating new page...')
    const page = await browser.newPage()

    // Generate HTML content for the resume
    console.log('Generating HTML...')
    const html = generateResumeHTML(resume, addWatermark)

    // Set content and wait for fonts/styles to load
    console.log('Setting HTML content...')
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Generate PDF with optimized settings
    console.log('Generating PDF...')
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    })

    console.log('PDF generated successfully, size:', pdf.length, 'bytes')
    return Buffer.from(pdf)
  } catch (error) {
    console.error('PDF generation error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    throw error
  } finally {
    if (browser) {
      console.log('Closing browser...')
      await browser.close()
    }
  }
}

function generateResumeHTML(resume: Resume, addWatermark: boolean): string {
  const { content, customization, template_id } = resume

  // Get template component based on template_id
  const templateHTML = getTemplateHTML(template_id, content, customization)

  // Base HTML structure with styles
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resume.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: ${getFontFamily(customization.font)};
          font-size: ${getFontSize(customization.font_size)};
          line-height: 1.5;
          color: #1f2937;
          background: white;
        }

        ${addWatermark ? getWatermarkStyles() : ''}

        /* Template-specific styles will be injected here */
        ${getTemplateStyles(template_id, customization)}
      </style>
    </head>
    <body>
      ${addWatermark ? '<div class="watermark">Generated with Resume AI - Upgrade to remove watermark</div>' : ''}
      ${templateHTML}
    </body>
    </html>
  `
}

function getFontFamily(font: string): string {
  const fontMap: Record<string, string> = {
    'Roboto': '"Roboto", system-ui, -apple-system, sans-serif',
    'Open Sans': '"Open Sans", system-ui, -apple-system, sans-serif',
    'Lato': '"Lato", system-ui, -apple-system, sans-serif',
  }
  return fontMap[font] || fontMap['Roboto']
}

function getFontSize(size: string): string {
  const sizeMap: Record<string, string> = {
    'small': '10pt',
    'medium': '11pt',
    'large': '12pt',
  }
  return sizeMap[size] || sizeMap['medium']
}

function getWatermarkStyles(): string {
  return `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 48px;
      font-weight: bold;
      color: rgba(200, 200, 200, 0.15);
      white-space: nowrap;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
    }

    @media print {
      .watermark {
        display: block !important;
      }
    }
  `
}

function getTemplateStyles(templateId: string, customization: any): string {
  const accentColor = customization.accent_color || '#3b82f6'

  return `
    .section-title {
      color: ${accentColor};
      font-size: 1.25em;
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      padding-bottom: 0.25em;
      border-bottom: 2px solid ${accentColor};
    }

    .section {
      margin-bottom: 1.5em;
    }

    .job-title,
    .degree-title {
      font-weight: 600;
      color: #111827;
    }

    .company-name,
    .institution-name {
      font-weight: 500;
      color: ${accentColor};
    }

    .date-range,
    .location {
      color: #6b7280;
      font-size: 0.9em;
    }

    .header {
      text-align: center;
      margin-bottom: 2em;
    }

    .header h1 {
      font-size: 2em;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.25em;
    }

    .header .professional-title {
      font-size: 1.1em;
      color: ${accentColor};
      font-weight: 500;
      margin-bottom: 0.5em;
    }

    .contact-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5em 1.5em;
      font-size: 0.9em;
      color: #6b7280;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }

    .skill-tag {
      background: ${accentColor}15;
      color: ${accentColor};
      padding: 0.25em 0.75em;
      border-radius: 0.25em;
      font-size: 0.9em;
    }

    ul {
      margin-left: 1.5em;
      margin-top: 0.5em;
    }

    li {
      margin-bottom: 0.25em;
    }

    .summary {
      margin-bottom: 1.5em;
      line-height: 1.6;
      color: #374151;
    }

    strong {
      font-weight: 700;
      color: #111827;
    }
  `
}

function getTemplateHTML(templateId: string, content: any, customization: any): string {
  const safeContent = {
    personal_info: content.personal_info || {},
    professional_summary: content.professional_summary || '',
    work_experience: content.work_experience || [],
    education: content.education || [],
    skills: {
      technical: content.skills?.technical || [],
      soft: content.skills?.soft || [],
      languages: content.skills?.languages || [],
      certifications: content.skills?.certifications || [],
    },
    additional_sections: content.additional_sections || {},
  }

  // Header section (common to all templates)
  const headerHTML = `
    <div class="header">
      <h1>${escapeHtml(safeContent.personal_info.full_name || 'Your Name')}</h1>
      <div class="professional-title">${escapeHtml(safeContent.personal_info.professional_title || '')}</div>
      <div class="contact-info">
        ${safeContent.personal_info.email ? `<span>${escapeHtml(safeContent.personal_info.email)}</span>` : ''}
        ${safeContent.personal_info.phone ? `<span>${escapeHtml(safeContent.personal_info.phone)}</span>` : ''}
        ${safeContent.personal_info.location ? `<span>${escapeHtml(safeContent.personal_info.location)}</span>` : ''}
        ${safeContent.personal_info.linkedin ? `<span>${escapeHtml(safeContent.personal_info.linkedin)}</span>` : ''}
      </div>
    </div>
  `

  // Summary section
  const summaryHTML = safeContent.professional_summary ? `
    <div class="section">
      <div class="summary">${formatTextWithBold(safeContent.professional_summary)}</div>
    </div>
  ` : ''

  // Experience section
  const experienceHTML = safeContent.work_experience.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Work Experience</h2>
      ${safeContent.work_experience.map((exp: any) => `
        <div style="margin-bottom: 1em;">
          <div class="job-title">${escapeHtml(exp.job_title || '')}</div>
          <div class="company-name">${escapeHtml(exp.company || '')}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
            <span class="date-range">${escapeHtml(exp.start_date || '')} - ${escapeHtml(exp.end_date || 'Present')}</span>
            <span class="location">${escapeHtml(exp.location || '')}</span>
          </div>
          ${exp.responsibilities && exp.responsibilities.length > 0 ? `
            <ul>
              ${exp.responsibilities.map((resp: string) => `<li>${formatTextWithBold(resp)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''

  // Education section
  const educationHTML = safeContent.education.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${safeContent.education.map((edu: any) => `
        <div style="margin-bottom: 1em;">
          <div class="degree-title">${escapeHtml(edu.degree || '')} in ${escapeHtml(edu.field_of_study || '')}</div>
          <div class="institution-name">${escapeHtml(edu.institution || '')}</div>
          <div class="date-range">${escapeHtml(edu.graduation_date || '')}</div>
          ${edu.gpa ? `<div style="margin-top: 0.25em;">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''

  // Skills section
  const skillsHTML = (safeContent.skills.technical.length > 0 || safeContent.skills.soft.length > 0) ? `
    <div class="section">
      <h2 class="section-title">Skills</h2>
      ${safeContent.skills.technical.length > 0 ? `
        <div style="margin-bottom: 1em;">
          <div style="font-weight: 600; margin-bottom: 0.5em;">Technical Skills</div>
          <div class="skills-list">
            ${safeContent.skills.technical.map((skill: string) => `
              <span class="skill-tag">${escapeHtml(skill)}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      ${safeContent.skills.soft.length > 0 ? `
        <div style="margin-bottom: 1em;">
          <div style="font-weight: 600; margin-bottom: 0.5em;">Soft Skills</div>
          <div class="skills-list">
            ${safeContent.skills.soft.map((skill: string) => `
              <span class="skill-tag">${escapeHtml(skill)}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  ` : ''

  return `
    <div style="max-width: 8.5in; margin: 0 auto; padding: 0.5in;">
      ${headerHTML}
      ${summaryHTML}
      ${experienceHTML}
      ${educationHTML}
      ${skillsHTML}
    </div>
  `
}

function escapeHtml(text: string): string {
  if (!text) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function formatTextWithBold(text: string): string {
  if (!text) return ''
  // First escape HTML
  let escaped = escapeHtml(text)
  // Then convert markdown bold (**text**) to HTML <strong> tags
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return escaped
}
