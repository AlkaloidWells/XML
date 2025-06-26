const fs = require('fs');
const xmldom = require('xmldom');
const xpath = require('xpath');

/**
 * Resume XML Validation Script
 * This script validates XML resume files against the XSD schema
 * and performs additional business logic validation
 */

class ResumeValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Validate XML file against XSD schema
     * Note: For full XSD validation, you would need a library like 'libxmljs2'
     * This is a simplified validation focusing on structure and business logic
     */
    validateXMLStructure(xmlContent) {
        try {
            const doc = new xmldom.DOMParser().parseFromString(xmlContent, 'text/xml');
            
            // Check for parsing errors
            const parseErrors = doc.getElementsByTagName('parsererror');
            if (parseErrors.length > 0) {
                this.errors.push('XML parsing error: ' + parseErrors[0].textContent);
                return false;
            }

            // Check root element
            if (doc.documentElement.tagName !== 'resume') {
                this.errors.push('Root element must be <resume>');
                return false;
            }

            return true;
        } catch (error) {
            this.errors.push('XML structure error: ' + error.message);
            return false;
        }
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone format
     */
    validatePhone(phone) {
        const phoneRegex = /^\+?[0-9\-\s\(\)]{7,20}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate date format and logic
     */
    validateDate(dateString, fieldName) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            this.errors.push(`Invalid date format in ${fieldName}: ${dateString}`);
            return false;
        }
        
        // Check if graduation date is in the future
        if (fieldName.includes('graduation') && date > new Date()) {
            this.warnings.push(`Future graduation date detected: ${dateString}`);
        }
        
        return true;
    }

    /**
     * Validate business logic rules
     */
    validateBusinessLogic(xmlContent) {
        const doc = new xmldom.DOMParser().parseFromString(xmlContent, 'text/xml');
        const select = xpath.useNamespaces({});

        try {
            // Validate email addresses
            const emails = select('//email/text()', doc);
            emails.forEach(email => {
                if (!this.validateEmail(email.nodeValue)) {
                    this.errors.push(`Invalid email format: ${email.nodeValue}`);
                }
            });

            // Validate phone numbers
            const phones = select('//phone/text()', doc);
            phones.forEach(phone => {
                if (!this.validatePhone(phone.nodeValue)) {
                    this.errors.push(`Invalid phone format: ${phone.nodeValue}`);
                }
            });

            // Validate dates
            const graduationDates = select('//graduationDate/text()', doc);
            graduationDates.forEach(date => {
                this.validateDate(date.nodeValue, 'graduation date');
            });

            const startDates = select('//startDate/text()', doc);
            startDates.forEach(date => {
                this.validateDate(date.nodeValue, 'start date');
            });

            const endDates = select('//endDate/text()', doc);
            endDates.forEach(date => {
                this.validateDate(date.nodeValue, 'end date');
            });

            // Validate employment date logic
            this.validateEmploymentDates(doc);

            // Validate required elements
            this.validateRequiredElements(doc);

            // Validate skill levels
            this.validateSkillLevels(doc);

            // Validate employment types
            this.validateEmploymentTypes(doc);

        } catch (error) {
            this.errors.push('Business logic validation error: ' + error.message);
        }
    }

    /**
     * Validate employment date logic
     */
    validateEmploymentDates(doc) {
        const select = xpath.useNamespaces({});
        const jobs = select('//job', doc);

        jobs.forEach((job, index) => {
            const startDateNode = select('./startDate/text()', job)[0];
            const endDateNode = select('./endDate/text()', job)[0];

            if (startDateNode && endDateNode) {
                const startDate = new Date(startDateNode.nodeValue);
                const endDate = new Date(endDateNode.nodeValue);

                if (startDate >= endDate) {
                    this.errors.push(`Job ${index + 1}: Start date must be before end date`);
                }
            }
        });
    }

    /**
     * Validate required elements exist
     */
    validateRequiredElements(doc) {
        const select = xpath.useNamespaces({});
        
        const requiredElements = [
            '//personalInfo',
            '//summary',
            '//skills',
            '//education',
            '//experience',
            '//languages'
        ];

        requiredElements.forEach(elementPath => {
            const elements = select(elementPath, doc);
            if (elements.length === 0) {
                this.errors.push(`Required element missing: ${elementPath.replace('//', '')}`);
            }
        });
    }

    /**
     * Validate skill levels against enumeration
     */
    validateSkillLevels(doc) {
        const select = xpath.useNamespaces({});
        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        
        const skills = select('//skill/@level', doc);
        skills.forEach(skill => {
            if (!validLevels.includes(skill.nodeValue)) {
                this.errors.push(`Invalid skill level: ${skill.nodeValue}. Must be one of: ${validLevels.join(', ')}`);
            }
        });
    }

    /**
     * Validate employment types against enumeration
     */
    validateEmploymentTypes(doc) {
        const select = xpath.useNamespaces({});
        const validTypes = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship', 'Temporary'];
        
        const employmentTypes = select('//employmentType/text()', doc);
        employmentTypes.forEach(type => {
            if (!validTypes.includes(type.nodeValue)) {
                this.errors.push(`Invalid employment type: ${type.nodeValue}. Must be one of: ${validTypes.join(', ')}`);
            }
        });
    }

    /**
     * Main validation function
     */
    validate(xmlFilePath) {
        console.log(`\n🔍 Validating: ${xmlFilePath}`);
        console.log('=' .repeat(50));

        this.errors = [];
        this.warnings = [];

        try {
            const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
            
            // Step 1: Validate XML structure
            if (!this.validateXMLStructure(xmlContent)) {
                this.printResults();
                return false;
            }

            // Step 2: Validate business logic
            this.validateBusinessLogic(xmlContent);

            // Step 3: Print results
            this.printResults();

            return this.errors.length === 0;

        } catch (error) {
            console.error(`❌ Error reading file: ${error.message}`);
            return false;
        }
    }

    /**
     * Print validation results
     */
    printResults() {
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ VALIDATION PASSED - No errors or warnings found');
        } else {
            if (this.errors.length > 0) {
                console.log(`❌ VALIDATION FAILED - ${this.errors.length} error(s) found:`);
                this.errors.forEach((error, index) => {
                    console.log(`   ${index + 1}. ${error}`);
                });
            }

            if (this.warnings.length > 0) {
                console.log(`⚠️  ${this.warnings.length} warning(s):`);
                this.warnings.forEach((warning, index) => {
                    console.log(`   ${index + 1}. ${warning}`);
                });
            }
        }
        console.log('');
    }
}

/**
 * Test runner function
 */
function runTests() {
    const validator = new ResumeValidator();
    
    const testFiles = [
        'resume.xml',                          // Valid resume
        'test-cases.xml',                      // Valid test case
        'invalid-email-test.xml',              // Invalid email
        'invalid-skill-level-test.xml',        // Invalid skill level
        'missing-required-elements-test.xml'   // Missing elements
    ];

    console.log('🚀 Starting Resume XML Validation Tests');
    console.log('='.repeat(60));

    let passCount = 0;
    let totalTests = testFiles.length;

    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const isValid = validator.validate(file);
            if (isValid) passCount++;
        } else {
            console.log(`⚠️  Test file not found: ${file}`);
        }
    });

    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${totalTests - passCount}`);
    console.log(`Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`);
}

// Export for module usage
module.exports = ResumeValidator;

// Run tests if called directly
if (require.main === module) {
    runTests();
}

/**
 * Usage Instructions:
 * 
 * 1. Install dependencies:
 *    npm install xmldom xpath
 * 
 * 2. Run validation:
 *    node validate-resume.js
 * 
 * 3. Or use programmatically:
 *    const ResumeValidator = require('./validate-resume');
 *    const validator = new ResumeValidator();
 *    validator.validate('resume.xml');
 */