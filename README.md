# XML Resume Project

## 📋 Overview

This project demonstrates how to create a professional, structured resume using XML, validated with XSD, and supported by comprehensive testing and visualization tools. The resume example is for a warehouse keeper, transformed into a robust XML document that can be validated, processed, and visually displayed.

---

## 🎯 Objectives

- **Build a professional resume using structured XML and XSD**
- **Implement comprehensive validation with error handling**
- **Create test cases for validation and correctness**
- **Develop application usage with error flags for violations**
- **Provide visual representation and reporting tools**

---

## 📁 Project Structure

```
XML-Resume-Project/
├── resume.xml                          # Main resume file
├── resume.xsd                          # XML Schema Definition
├── test-cases.xml                      # Valid test case
├── invalid-email-test.xml              # Email validation test
├── invalid-skill-level-test.xml        # Skill level validation test
├── missing-required-elements-test.xml  # Required elements test
├── validate-resume.js                  # Node.js validation script
├── resume-viewer.html                  # HTML viewer application
├── package.json                        # Node.js dependencies
└── README.md                           # Documentation
```

---

## 🔧 Tools and Technologies

- **VS Code** (with XML extensions)
- **XML Notepad** (Microsoft)
- **Node.js** (validation scripting)
- **HTML/CSS/JavaScript** (web viewer)
- **XSD Schema Validation**
- **Custom Business Logic Validation**
- **Online XSD Validators**

---

## 📊 Schema Design

**Root Structure:**

```xml
<resume>
  <personalInfo/>
  <summary/>
  <skills/>
  <education/>
  <experience/>
  <volunteerExperience/> <!-- optional -->
  <languages/>
  <references/> <!-- optional -->
</resume>
```

**Key Features:**

- **Email Format:** `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- **Phone Format:** `\+?[0-9\-\s\(\)]{7,20}`
- **Date Format:** ISO 8601 (YYYY-MM-DD)
- **Skill Levels:** `beginner | intermediate | advanced | expert`
- **Employment Types:** `Full-Time | Part-Time | Contract | Freelance | Internship | Temporary`
- **Degree Levels:** `High School | Associate | Bachelor | Master | Doctorate | Certificate | Diploma`
- **Language Proficiency:** `basic | conversational | fluent | native | professional`

---

## 🧪 Testing Framework

**Test Categories:**

- **Positive:**
  - Valid Resume
  - Minimal valid structure
  - Optional elements (volunteer, references)
- **Negative:**
  - Invalid email format
  - Invalid skill level
  - Missing required elements
  - Invalid phone format
  - Invalid employment type
  - Future graduation date
- **Business Logic:**
  - Date consistency
  - Email/phone validation
  - Required elements

---

## 🚀 Validation Implementation

**Layer 1: XML Structure Validation**

```javascript
validateXMLStructure(xmlContent) {
    const doc = new xmldom.DOMParser().parseFromString(xmlContent, 'text/xml');
    const parseErrors = doc.getElementsByTagName('parsererror');
    if (parseErrors.length > 0) {
        this.errors.push('XML parsing error: ' + parseErrors[0].textContent);
        return false;
    }
    return true;
}
```

**Layer 2: XSD Schema Validation**

- Checks structure, data types, required elements, and attributes.

**Layer 3: Business Logic Validation**

```javascript
validateBusinessLogic(xmlContent) {
    // Email format validation
    // Phone number validation
    // Date logic validation
    // Employment date consistency
    // Enumeration value checking
}
```

---

## 📈 Test Results

| Test Case           | Expected | Actual  | Status     |
| ------------------- | -------- | ------- | ---------- |
| Valid Resume        | ✅ Pass  | ✅ Pass | ✅ Success |
| Invalid Email       | ❌ Fail  | ❌ Fail | ✅ Success |
| Invalid Skill Level | ❌ Fail  | ❌ Fail | ✅ Success |
| Missing Elements    | ❌ Fail  | ❌ Fail | ✅ Success |
| Future Graduation   | ⚠️ Warn  | ⚠️ Warn | ✅ Success |

**Error Handling Examples:**

- **Email Validation Error:**
  ```
  ❌ VALIDATION FAILED - 1 error(s) found:
     1. Invalid email format: invalid-email-format.com
  ```
- **Skill Level Validation Error:**
  ```
  ❌ VALIDATION FAILED - 1 error(s) found:
     1. Invalid skill level: master. Must be one of: beginner, intermediate, advanced, expert
  ```
- **Missing Elements Error:**
  ```
  ❌ VALIDATION FAILED - 2 error(s) found:
     1. Required element missing: education
     2. Required element missing: languages
  ```

---

## 🖥️ Application Features

- **HTML Resume Viewer:** Drag-and-drop XML upload, real-time validation, responsive design, professional styling, interactive elements.
- **Validation Script:** Detailed error reporting, warning system, automated test suite, modular design.

---

## 📸 Visual Documentation

- **VS Code XML Editing:** _Screenshot placeholder_
- **XSD Schema Validation:** _Screenshot placeholder_
- **HTML Resume Viewer:** _Screenshot placeholder_
- **Validation Results:** _Screenshot placeholder_
- **Error Handling:** _Screenshot placeholder_

---

## 🔧 Setup Instructions

_Add your setup and usage instructions here, e.g., how to install dependencies, run validation, and view the resume._

---
