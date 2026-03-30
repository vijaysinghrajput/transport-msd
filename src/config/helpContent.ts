// Help content for all HR and Finance pages in English and Hindi

export const HELP_CONTENT = {
  // HR Pages
  departments: {
    titleEn: "Department Management",
    titleHi: "विभाग प्रबंधन",
    stepsEn: [
      "Click 'Add Department' button to create new department",
      "Enter department name (e.g., Sales, Operations, HR)",
      "Select department manager from dropdown list",
      "Enter total headcount (number of employees in department)",
      "Add description about department's role",
      "Click Submit to save the department"
    ],
    stepsHi: [
      "नया विभाग बनाने के लिए 'विभाग जोड़ें' बटन पर क्लिक करें",
      "विभाग का नाम दर्ज करें (जैसे, बिक्री, संचालन, एचआर)",
      "ड्रॉपडाउन सूची से विभाग प्रबंधक का चयन करें",
      "कुल हेडकाउंट दर्ज करें (विभाग में कर्मचारियों की संख्या)",
      "विभाग की भूमिका के बारे में विवरण जोड़ें",
      "विभाग को सहेजने के लिए Submit पर क्लिक करें"
    ],
    tipsEn: [
      "Department manager should be a senior staff member",
      "Headcount helps track department growth",
      "You can edit or delete departments anytime",
      "Assign employees to departments in Employee Management page"
    ],
    tipsHi: [
      "विभाग प्रबंधक एक वरिष्ठ कर्मचारी सदस्य होना चाहिए",
      "हेडकाउंट विभाग की वृद्धि को ट्रैक करने में मदद करता है",
      "आप किसी भी समय विभागों को संपादित या हटा सकते हैं",
      "कर्मचारी प्रबंधन पेज में विभागों को कर्मचारी असाइन करें"
    ]
  },

  employees: {
    titleEn: "Employee Management",
    titleHi: "कर्मचारी प्रबंधन",
    stepsEn: [
      "Click 'Add Employee' to register new employee",
      "Select user account (created in Users page first)",
      "Choose department and designation",
      "Enter joining date and employment type (Full-time/Part-time/Contract)",
      "Add salary details, bank account, PF/ESI numbers",
      "Enter emergency contact information",
      "Click Submit to save employee record"
    ],
    stepsHi: [
      "नए कर्मचारी को रजिस्टर करने के लिए 'कर्मचारी जोड़ें' पर क्लिक करें",
      "उपयोगकर्ता खाता चुनें (पहले उपयोगकर्ता पृष्ठ में बनाया गया)",
      "विभाग और पदनाम चुनें",
      "शामिल होने की तारीख और रोजगार प्रकार दर्ज करें (पूर्णकालिक/अंशकालिक/अनुबंध)",
      "वेतन विवरण, बैंक खाता, पीएफ/ईएसआई नंबर जोड़ें",
      "आपातकालीन संपर्क जानकारी दर्ज करें",
      "कर्मचारी रिकॉर्ड सहेजने के लिए Submit पर क्लिक करें"
    ],
    tipsEn: [
      "Create user account first in Users Management page",
      "Employment type affects leave calculations",
      "PF/ESI numbers required for statutory compliance",
      "Emergency contact is mandatory for safety",
      "You can update employee details anytime"
    ],
    tipsHi: [
      "पहले उपयोगकर्ता प्रबंधन पृष्ठ में उपयोगकर्ता खाता बनाएं",
      "रोजगार प्रकार अवकाश गणना को प्रभावित करता है",
      "वैधानिक अनुपालन के लिए पीएफ/ईएसआई नंबर आवश्यक है",
      "सुरक्षा के लिए आपातकालीन संपर्क अनिवार्य है",
      "आप किसी भी समय कर्मचारी विवरण अपडेट कर सकते हैं"
    ]
  },

  leaves: {
    titleEn: "Leave Management",
    titleHi: "अवकाश प्रबंधन",
    stepsEn: [
      "Employee: Click 'Apply Leave' to request leave",
      "Select leave type (Casual, Sick, Earned, etc.)",
      "Choose start date and end date",
      "Enter reason for leave request",
      "Submit application - manager will receive notification",
      "Manager: Review pending requests and Approve/Reject",
      "Employee can view leave status and balance"
    ],
    stepsHi: [
      "कर्मचारी: छुट्टी का अनुरोध करने के लिए 'छुट्टी लागू करें' पर क्लिक करें",
      "छुट्टी का प्रकार चुनें (आकस्मिक, बीमार, अर्जित, आदि)",
      "प्रारंभ तिथि और समाप्ति तिथि चुनें",
      "छुट्टी के अनुरोध का कारण दर्ज करें",
      "आवेदन जमा करें - प्रबंधक को सूचना मिलेगी",
      "प्रबंधक: लंबित अनुरोधों की समीक्षा करें और स्वीकृत/अस्वीकार करें",
      "कर्मचारी छुट्टी की स्थिति और शेष देख सकते हैं"
    ],
    tipsEn: [
      "Apply leave at least 2 days in advance",
      "Casual Leave: 12 days per year",
      "Sick Leave: Requires medical certificate for 3+ days",
      "Earned Leave: Accrues monthly, can be carried forward",
      "Check your leave balance before applying"
    ],
    tipsHi: [
      "कम से कम 2 दिन पहले छुट्टी के लिए आवेदन करें",
      "आकस्मिक अवकाश: प्रति वर्ष 12 दिन",
      "बीमारी की छुट्टी: 3+ दिनों के लिए मेडिकल सर्टिफिकेट आवश्यक",
      "अर्जित अवकाश: मासिक अर्जित, आगे ले जाया जा सकता है",
      "आवेदन करने से पहले अपना अवकाश शेष जांचें"
    ]
  },

  // Payroll Pages
  salaryStructures: {
    titleEn: "Salary Structure Management",
    titleHi: "वेतन संरचना प्रबंधन",
    stepsEn: [
      "Click 'Create Salary Structure' for new employee",
      "Select employee from dropdown",
      "Enter Basic Salary amount",
      "Add allowances: HRA, DA, Travel, Medical, etc.",
      "Add deductions: PF, ESI, Professional Tax, TDS",
      "System automatically calculates: Gross Salary, Total Deductions, Net Salary",
      "Click Submit to save salary structure"
    ],
    stepsHi: [
      "नए कर्मचारी के लिए 'वेतन संरचना बनाएं' पर क्लिक करें",
      "ड्रॉपडाउन से कर्मचारी का चयन करें",
      "मूल वेतन राशि दर्ज करें",
      "भत्ते जोड़ें: HRA, DA, यात्रा, चिकित्सा, आदि",
      "कटौती जोड़ें: PF, ESI, व्यावसायिक कर, TDS",
      "सिस्टम स्वचालित रूप से गणना करता है: सकल वेतन, कुल कटौती, नेट वेतन",
      "वेतन संरचना को सहेजने के लिए Submit पर क्लिक करें"
    ],
    tipsEn: [
      "Formula: Net Salary = Gross Salary - Total Deductions",
      "HRA typically 40-50% of Basic Salary",
      "PF: 12% of Basic (Employee) + 12% (Employer)",
      "ESI: 0.75% of Gross (Employee) + 3.25% (Employer)",
      "Review salary structure annually for increments"
    ],
    tipsHi: [
      "फॉर्मूला: नेट वेतन = सकल वेतन - कुल कटौती",
      "HRA आम तौर पर मूल वेतन का 40-50%",
      "PF: मूल का 12% (कर्मचारी) + 12% (नियोक्ता)",
      "ESI: सकल का 0.75% (कर्मचारी) + 3.25% (नियोक्ता)",
      "वेतन वृद्धि के लिए वार्षिक वेतन संरचना की समीक्षा करें"
    ]
  },

  payrollRuns: {
    titleEn: "Payroll Processing",
    titleHi: "पेरोल प्रोसेसिंग",
    stepsEn: [
      "Click 'Generate Payroll' at month-end",
      "Select month and year for payroll",
      "System fetches all active employees and their salary structures",
      "System calculates attendance, leaves, overtime automatically",
      "Review payroll details: Gross, Deductions, Net for each employee",
      "Click 'Process Payroll' to finalize",
      "Mark as 'Completed' after salary transfer to bank accounts"
    ],
    stepsHi: [
      "महीने के अंत में 'पेरोल उत्पन्न करें' पर क्लिक करें",
      "पेरोल के लिए महीना और वर्ष चुनें",
      "सिस्टम सभी सक्रिय कर्मचारियों और उनकी वेतन संरचनाओं को लाता है",
      "सिस्टम उपस्थिति, छुट्टियां, ओवरटाइम स्वचालित रूप से गणना करता है",
      "पेरोल विवरण की समीक्षा करें: प्रत्येक कर्मचारी के लिए सकल, कटौती, नेट",
      "अंतिम रूप देने के लिए 'पेरोल प्रोसेस करें' पर क्लिक करें",
      "बैंक खातों में वेतन स्थानांतरण के बाद 'पूर्ण' के रूप में चिह्नित करें"
    ],
    tipsEn: [
      "Process payroll between 25th-30th of each month",
      "Verify attendance data before processing",
      "Check for leave deductions and overtime additions",
      "Generate salary slips after marking as completed",
      "This amount shows in Cash Flow as Outflow (money going out)"
    ],
    tipsHi: [
      "हर महीने की 25-30 तारीख के बीच पेरोल प्रोसेस करें",
      "प्रोसेसिंग से पहले उपस्थिति डेटा सत्यापित करें",
      "छुट्टी की कटौती और ओवरटाइम जोड़ की जांच करें",
      "पूर्ण के रूप में चिह्नित करने के बाद वेतन पर्ची उत्पन्न करें",
      "यह राशि कैश फ्लो में आउटफ्लो के रूप में दिखाई देती है (पैसा बाहर जा रहा है)"
    ]
  },

  payslips: {
    titleEn: "Salary Slips",
    titleHi: "वेतन पर्ची",
    stepsEn: [
      "Select month and year to view salary slips",
      "Filter by employee name if needed",
      "View detailed breakdown: Earnings, Deductions, Net Pay",
      "Click 'Download PDF' to save salary slip",
      "Click 'Print' to print physical copy",
      "Email option to send slip directly to employee"
    ],
    stepsHi: [
      "वेतन पर्ची देखने के लिए महीना और वर्ष चुनें",
      "यदि आवश्यक हो तो कर्मचारी के नाम से फ़िल्टर करें",
      "विस्तृत विवरण देखें: आय, कटौती, नेट वेतन",
      "वेतन पर्ची सहेजने के लिए 'PDF डाउनलोड करें' पर क्लिक करें",
      "भौतिक प्रति प्रिंट करने के लिए 'प्रिंट' पर क्लिक करें",
      "कर्मचारी को सीधे पर्ची भेजने के लिए ईमेल विकल्प"
    ],
    tipsEn: [
      "Salary slips are generated after payroll processing",
      "Each slip shows company letterhead and details",
      "Contains: Earnings (Basic, HRA, DA), Deductions (PF, ESI, Tax)",
      "Net Pay = Gross Earnings - Total Deductions",
      "Keep salary slips for tax filing and loan applications"
    ],
    tipsHi: [
      "पेरोल प्रोसेसिंग के बाद वेतन पर्ची उत्पन्न होती हैं",
      "प्रत्येक पर्ची में कंपनी लेटरहेड और विवरण दिखाई देता है",
      "शामिल: आय (मूल, HRA, DA), कटौती (PF, ESI, कर)",
      "नेट वेतन = सकल आय - कुल कटौती",
      "कर फाइलिंग और ऋण आवेदन के लिए वेतन पर्ची रखें"
    ]
  },

  loans: {
    titleEn: "Employee Loans & Advances",
    titleHi: "कर्मचारी ऋण और अग्रिम",
    stepsEn: [
      "Click 'Add Loan' to create new loan/advance",
      "Select employee and loan type (Personal, Vehicle, Education, Medical, Emergency, Salary Advance)",
      "Enter loan amount and interest rate (if any)",
      "Choose repayment tenure in months (1-60)",
      "Select EMI calculation method: Straight-line or Declining Balance",
      "System calculates EMI amount automatically",
      "Submit for approval - manager reviews and approves",
      "EMI deducted from salary every month until balance = 0"
    ],
    stepsHi: [
      "नया ऋण/अग्रिम बनाने के लिए 'ऋण जोड़ें' पर क्लिक करें",
      "कर्मचारी और ऋण प्रकार चुनें (व्यक्तिगत, वाहन, शिक्षा, चिकित्सा, आपातकालीन, वेतन अग्रिम)",
      "ऋण राशि और ब्याज दर दर्ज करें (यदि कोई हो)",
      "महीनों में पुनर्भुगतान अवधि चुनें (1-60)",
      "EMI गणना विधि चुनें: सीधी रेखा या घटती शेष",
      "सिस्टम स्वचालित रूप से EMI राशि की गणना करता है",
      "अनुमोदन के लिए जमा करें - प्रबंधक समीक्षा करता है और स्वीकृत करता है",
      "शेष = 0 होने तक हर महीने वेतन से EMI काटी जाती है"
    ],
    tipsEn: [
      "Salary Advance: Usually interest-free, short tenure",
      "Personal Loan: Higher interest rate, longer tenure",
      "EMI auto-deducted from monthly salary",
      "Balance tracked with progress bar",
      "Loan closed automatically when fully repaid",
      "This shows in Cash Flow as Financing Outflow (money given to employee)"
    ],
    tipsHi: [
      "वेतन अग्रिम: आमतौर पर ब्याज मुक्त, कम अवधि",
      "व्यक्तिगत ऋण: अधिक ब्याज दर, लंबी अवधि",
      "मासिक वेतन से EMI स्वतः कटौती",
      "प्रगति बार के साथ शेष ट्रैक किया गया",
      "पूरी तरह से चुकाने पर ऋण स्वचालित रूप से बंद हो जाता है",
      "यह कैश फ्लो में वित्तपोषण आउटफ्लो के रूप में दिखाता है (कर्मचारी को दिया गया पैसा)"
    ]
  },

  // Finance Pages
  invoices: {
    titleEn: "Invoice Management",
    titleHi: "इनवॉइस प्रबंधन",
    stepsEn: [
      "Click 'Create Invoice' when customer buys/pays",
      "Enter customer details: Name, Phone, Email, Address",
      "Add invoice items: Product/Service, Quantity, Rate",
      "System calculates: Subtotal, GST (18%), Total Amount",
      "Select payment status: Paid/Partially Paid/Unpaid",
      "Enter paid amount if payment received",
      "Click Submit - Invoice number auto-generated (INV-YYYYMM-XXXX)",
      "Download PDF or print invoice to give to customer"
    ],
    stepsHi: [
      "जब ग्राहक खरीदता/भुगतान करता है तो 'इनवॉइस बनाएं' पर क्लिक करें",
      "ग्राहक विवरण दर्ज करें: नाम, फोन, ईमेल, पता",
      "इनवॉइस आइटम जोड़ें: उत्पाद/सेवा, मात्रा, दर",
      "सिस्टम गणना करता है: उप-योग, GST (18%), कुल राशि",
      "भुगतान स्थिति चुनें: भुगतान किया गया/आंशिक रूप से भुगतान किया गया/अवैतनिक",
      "यदि भुगतान प्राप्त हुआ है तो भुगतान की गई राशि दर्ज करें",
      "Submit पर क्लिक करें - इनवॉइस नंबर स्वतः उत्पन्न (INV-YYYYMM-XXXX)",
      "ग्राहक को देने के लिए PDF डाउनलोड करें या इनवॉइस प्रिंट करें"
    ],
    tipsEn: [
      "Invoice = Money COMING IN to your company (Credit/Inflow)",
      "When marked 'Paid', it shows in Cash Flow as GREEN inflow",
      "GST automatically calculated at 18%",
      "Keep invoice copies for tax filing and audit",
      "Follow up on unpaid invoices regularly",
      "Due date helps track payment deadlines"
    ],
    tipsHi: [
      "इनवॉइस = आपकी कंपनी में पैसा आ रहा है (क्रेडिट/इनफ्लो)",
      "जब 'भुगतान किया गया' के रूप में चिह्नित किया जाता है, तो यह कैश फ्लो में ग्रीन इनफ्लो के रूप में दिखाता है",
      "GST स्वचालित रूप से 18% पर गणना",
      "कर फाइलिंग और ऑडिट के लिए इनवॉइस प्रतियां रखें",
      "अवैतनिक इनवॉइस का नियमित रूप से अनुसरण करें",
      "नियत तारीख भुगतान समय सीमा को ट्रैक करने में मदद करती है"
    ]
  },

  expenses: {
    titleEn: "Expense Claims & Vendor Payments",
    titleHi: "व्यय दावे और विक्रेता भुगतान",
    stepsEn: [
      "Click 'Create Expense Claim' to record money going out",
      "Use this for: Vendor payments, office rent, utilities, supplies, travel",
      "Enter claimant name (yourself or department)",
      "Purpose: Describe what you're paying for (e.g., 'Payment to ABC Suppliers - Solar Panels')",
      "Add expense items: Item name, Amount, Category (select from dropdown)",
      "Attach bills/receipts if available",
      "Submit for approval - manager reviews",
      "After approval, mark as 'Paid' when payment is done",
      "Paid expenses show in Cash Flow as RED outflow"
    ],
    stepsHi: [
      "पैसा बाहर जाने का रिकॉर्ड करने के लिए 'व्यय दावा बनाएं' पर क्लिक करें",
      "इसका उपयोग करें: विक्रेता भुगतान, कार्यालय किराया, उपयोगिताएं, आपूर्ति, यात्रा",
      "दावेदार का नाम दर्ज करें (स्वयं या विभाग)",
      "उद्देश्य: वर्णन करें कि आप किसके लिए भुगतान कर रहे हैं (जैसे, 'एबीसी आपूर्तिकर्ताओं को भुगतान - सोलर पैनल')",
      "व्यय आइटम जोड़ें: आइटम का नाम, राशि, श्रेणी (ड्रॉपडाउन से चुनें)",
      "यदि उपलब्ध हो तो बिल/रसीदें संलग्न करें",
      "अनुमोदन के लिए जमा करें - प्रबंधक समीक्षा करता है",
      "अनुमोदन के बाद, भुगतान होने पर 'भुगतान किया गया' के रूप में चिह्नित करें",
      "भुगतान किए गए खर्चे कैश फ्लो में लाल आउटफ्लो के रूप में दिखाई देते हैं"
    ],
    tipsEn: [
      "Expense = Money GOING OUT from your company (Debit/Outflow)",
      "Use for ALL vendor/supplier payments",
      "Example: 'Payment to XYZ Ltd - Solar Panels ₹5,00,000'",
      "Multiple items allowed in single expense claim",
      "Attach bills/receipts for audit trail",
      "Status flow: Pending → Approved → Paid",
      "Paid expenses reduce your cash balance"
    ],
    tipsHi: [
      "व्यय = आपकी कंपनी से पैसा बाहर जा रहा है (डेबिट/आउटफ्लो)",
      "सभी विक्रेता/आपूर्तिकर्ता भुगतान के लिए उपयोग करें",
      "उदाहरण: 'XYZ लिमिटेड को भुगतान - सोलर पैनल ₹5,00,000'",
      "एकल व्यय दावे में कई आइटम की अनुमति",
      "ऑडिट ट्रेल के लिए बिल/रसीदें संलग्न करें",
      "स्थिति प्रवाह: लंबित → स्वीकृत → भुगतान किया गया",
      "भुगतान किए गए खर्चे आपके नकद शेष को कम करते हैं"
    ]
  },

  creditNotes: {
    titleEn: "Credit Notes & Refunds",
    titleHi: "क्रेडिट नोट और रिफंड",
    stepsEn: [
      "Click 'Create Credit Note' when you need to refund customer or adjust invoice",
      "Select original invoice from dropdown",
      "Enter credit amount (cannot exceed invoice amount)",
      "Select reason: Product Return, Price Adjustment, Discount, Damaged Goods, Billing Error",
      "Add detailed notes explaining the credit",
      "Submit for approval",
      "Manager approves/rejects the credit note",
      "Approved credit notes are tracked separately"
    ],
    stepsHi: [
      "जब आपको ग्राहक को रिफंड करने या इनवॉइस को समायोजित करने की आवश्यकता हो तो 'क्रेडिट नोट बनाएं' पर क्लिक करें",
      "ड्रॉपडाउन से मूल इनवॉइस का चयन करें",
      "क्रेडिट राशि दर्ज करें (इनवॉइस राशि से अधिक नहीं हो सकती)",
      "कारण चुनें: उत्पाद रिटर्न, मूल्य समायोजन, छूट, क्षतिग्रस्त सामान, बिलिंग त्रुटि",
      "क्रेडिट की व्याख्या करते हुए विस्तृत नोट्स जोड़ें",
      "अनुमोदन के लिए जमा करें",
      "प्रबंधक क्रेडिट नोट को स्वीकृत/अस्वीकार करता है",
      "स्वीकृत क्रेडिट नोट्स को अलग से ट्रैक किया जाता है"
    ],
    tipsEn: [
      "Credit Note = Money going back to customer (reverse of invoice)",
      "Must link to original invoice",
      "Auto-generated number: CN-YYYYMM-XXXX",
      "Requires manager approval before processing",
      "Keep records for GST compliance",
      "Reduces your total revenue"
    ],
    tipsHi: [
      "क्रेडिट नोट = ग्राहक को पैसा वापस जा रहा है (इनवॉइस का उल्टा)",
      "मूल इनवॉइस से लिंक होना चाहिए",
      "स्वतः उत्पन्न संख्या: CN-YYYYMM-XXXX",
      "प्रोसेसिंग से पहले प्रबंधक की स्वीकृति आवश्यक",
      "GST अनुपालन के लिए रिकॉर्ड रखें",
      "आपके कुल राजस्व को कम करता है"
    ]
  },

  journalEntries: {
    titleEn: "Journal Entries & Bookkeeping",
    titleHi: "जर्नल प्रविष्टियां और बहीखाता",
    stepsEn: [
      "Click 'Create Journal Entry' for manual accounting entries",
      "Enter entry date and description",
      "Add account lines: Click '+' to add multiple accounts",
      "For each line: Select account, enter Debit OR Credit (not both)",
      "System validates: Total Debits must equal Total Credits",
      "Real-time balance checking prevents errors",
      "Once balanced, click Submit to post entry",
      "Auto-generated entry number: JE-YYYYMM-XXXX"
    ],
    stepsHi: [
      "मैनुअल लेखा प्रविष्टियों के लिए 'जर्नल प्रविष्टि बनाएं' पर क्लिक करें",
      "प्रविष्टि तिथि और विवरण दर्ज करें",
      "खाता लाइनें जोड़ें: कई खाते जोड़ने के लिए '+' पर क्लिक करें",
      "प्रत्येक लाइन के लिए: खाता चुनें, डेबिट या क्रेडिट दर्ज करें (दोनों नहीं)",
      "सिस्टम सत्यापित करता है: कुल डेबिट कुल क्रेडिट के बराबर होना चाहिए",
      "वास्तविक समय शेष जांच त्रुटियों को रोकती है",
      "संतुलित होने पर, प्रविष्टि पोस्ट करने के लिए Submit पर क्लिक करें",
      "स्वतः उत्पन्न प्रविष्टि संख्या: JE-YYYYMM-XXXX"
    ],
    tipsEn: [
      "Double-entry bookkeeping: Debits = Credits always",
      "Debit increases: Assets, Expenses",
      "Credit increases: Liabilities, Revenue, Equity",
      "Red alert shows if entry is unbalanced",
      "Choose accounts from chart of accounts (19 accounts available)",
      "Use for adjustments, corrections, accruals"
    ],
    tipsHi: [
      "दोहरी प्रविष्टि बहीखाता: डेबिट = क्रेडिट हमेशा",
      "डेबिट बढ़ाता है: संपत्ति, खर्चे",
      "क्रेडिट बढ़ाता है: देनदारियां, राजस्व, इक्विटी",
      "यदि प्रविष्टि असंतुलित है तो लाल अलर्ट दिखाता है",
      "खातों के चार्ट से खाते चुनें (19 खाते उपलब्ध)",
      "समायोजन, सुधार, अर्जन के लिए उपयोग करें"
    ]
  },

  assets: {
    titleEn: "Asset Management & Depreciation",
    titleHi: "संपत्ति प्रबंधन और मूल्यह्रास",
    stepsEn: [
      "Click 'Add Asset' when you buy equipment/vehicle/furniture",
      "Select asset type: Computer/IT, Furniture, Vehicle, Machinery, Building, Other",
      "Enter asset name and purchase cost",
      "Select purchase date",
      "Enter useful life in years (1-50)",
      "Enter salvage value (residual value at end of life)",
      "Choose depreciation method: Straight-line or Declining Balance",
      "System auto-calculates: Monthly depreciation, Accumulated depreciation, Current value",
      "Track asset location and status"
    ],
    stepsHi: [
      "जब आप उपकरण/वाहन/फर्नीचर खरीदते हैं तो 'संपत्ति जोड़ें' पर क्लिक करें",
      "संपत्ति प्रकार चुनें: कंप्यूटर/आईटी, फर्नीचर, वाहन, मशीनरी, भवन, अन्य",
      "संपत्ति का नाम और खरीद लागत दर्ज करें",
      "खरीद तिथि चुनें",
      "वर्षों में उपयोगी जीवन दर्ज करें (1-50)",
      "बचाव मूल्य दर्ज करें (जीवन के अंत में अवशिष्ट मूल्य)",
      "मूल्यह्रास विधि चुनें: सीधी रेखा या घटती शेष",
      "सिस्टम स्वतः गणना करता है: मासिक मूल्यह्रास, संचित मूल्यह्रास, वर्तमान मूल्य",
      "संपत्ति का स्थान और स्थिति ट्रैक करें"
    ],
    tipsEn: [
      "Asset purchase shows in Cash Flow as Investing Outflow",
      "Straight-line: (Cost - Salvage) / Useful Life per year",
      "Declining Balance: 2 / Useful Life × Book Value",
      "Depreciation auto-calculated based on asset age",
      "Current Value = Purchase Cost - Accumulated Depreciation",
      "Mark as 'Disposed' when asset is sold/discarded",
      "Progress bar shows depreciation percentage"
    ],
    tipsHi: [
      "संपत्ति खरीद कैश फ्लो में निवेश आउटफ्लो के रूप में दिखाई देती है",
      "सीधी रेखा: (लागत - बचाव) / प्रति वर्ष उपयोगी जीवन",
      "घटती शेष: 2 / उपयोगी जीवन × पुस्तक मूल्य",
      "संपत्ति की आयु के आधार पर मूल्यह्रास स्वतः गणना",
      "वर्तमान मूल्य = खरीद लागत - संचित मूल्यह्रास",
      "जब संपत्ति बेची/निपटाई जाती है तो 'निपटान' के रूप में चिह्नित करें",
      "प्रगति बार मूल्यह्रास प्रतिशत दिखाता है"
    ]
  },

  accounting: {
    titleEn: "Accounting Dashboard & Reports",
    titleHi: "लेखा डैशबोर्ड और रिपोर्ट",
    stepsEn: [
      "View overall financial summary at a glance",
      "Total Revenue: All paid invoices",
      "Total Expenses: All paid expense claims + payroll",
      "Net Profit: Revenue - Expenses (Profit Margin %)",
      "Invoice stats: Total, Paid, Pending payments",
      "Use date range filter to view specific period",
      "See all account balances (19 accounts)",
      "View recent transactions across all accounts",
      "Check expense breakdown by category",
      "Monitor revenue vs expenses trend"
    ],
    stepsHi: [
      "एक नज़र में समग्र वित्तीय सारांश देखें",
      "कुल राजस्व: सभी भुगतान किए गए इनवॉइस",
      "कुल खर्चे: सभी भुगतान किए गए व्यय दावे + पेरोल",
      "नेट लाभ: राजस्व - खर्चे (लाभ मार्जिन %)",
      "इनवॉइस आंकड़े: कुल, भुगतान किया गया, लंबित भुगतान",
      "विशिष्ट अवधि देखने के लिए तिथि सीमा फ़िल्टर का उपयोग करें",
      "सभी खाता शेष देखें (19 खाते)",
      "सभी खातों में हाल के लेनदेन देखें",
      "श्रेणी द्वारा व्यय विभाजन जांचें",
      "राजस्व बनाम खर्चे की प्रवृत्ति की निगरानी करें"
    ],
    tipsEn: [
      "Green figures = Good (Revenue, Profit)",
      "Red figures = Watch (Expenses, Losses)",
      "Profit Margin = (Net Profit / Revenue) × 100",
      "Compare month-over-month performance",
      "Track pending payments for cash flow planning",
      "Export reports for management review"
    ],
    tipsHi: [
      "हरे आंकड़े = अच्छा (राजस्व, लाभ)",
      "लाल आंकड़े = ध्यान दें (खर्चे, नुकसान)",
      "लाभ मार्जिन = (नेट लाभ / राजस्व) × 100",
      "महीने-दर-महीने प्रदर्शन की तुलना करें",
      "कैश फ्लो योजना के लिए लंबित भुगतान ट्रैक करें",
      "प्रबंधन समीक्षा के लिए रिपोर्ट निर्यात करें"
    ]
  },

  cashFlow: {
    titleEn: "Cash Flow & Treasury Management",
    titleHi: "कैश फ्लो और ट्रेजरी प्रबंधन",
    stepsEn: [
      "Add Bank Accounts: Click 'Add Bank Account' to register all your company bank accounts with current balances",
      "Money IN (Invoice): When customer pays you, create Invoice and mark as 'Paid' - this shows as Green Inflow",
      "Money OUT (Expenses): When you pay vendors/suppliers, create Expense Claim and mark as 'Paid' - this shows as Red Outflow",
      "Money OUT (Salaries): Process monthly payroll - this automatically shows as salary outflow",
      "View Dashboard: Opening Balance + Inflows - Outflows = Closing Balance",
      "Check Tabs: Bank Accounts (balances), Transactions (all money movements), Cash Flow Statement (detailed report)"
    ],
    stepsHi: [
      "बैंक खाते जोड़ें: अपने सभी कंपनी बैंक खातों को वर्तमान शेष के साथ रजिस्टर करने के लिए 'बैंक खाता जोड़ें' पर क्लिक करें",
      "पैसा आना (इनवॉइस): जब ग्राहक आपको भुगतान करता है, तो इनवॉइस बनाएं और 'भुगतान किया गया' के रूप में चिह्नित करें - यह ग्रीन इनफ्लो के रूप में दिखता है",
      "पैसा जाना (खर्चे): जब आप विक्रेताओं/आपूर्तिकर्ताओं को भुगतान करते हैं, तो व्यय दावा बनाएं और 'भुगतान किया गया' के रूप में चिह्नित करें - यह लाल आउटफ्लो के रूप में दिखता है",
      "पैसा जाना (वेतन): मासिक पेरोल प्रोसेस करें - यह स्वचालित रूप से वेतन आउटफ्लो के रूप में दिखता है",
      "डैशबोर्ड देखें: शुरुआती शेष + इनफ्लो - आउटफ्लो = समापन शेष",
      "टैब जांचें: बैंक खाते (शेष), लेनदेन (सभी पैसे की गति), कैश फ्लो स्टेटमेंट (विस्तृत रिपोर्ट)"
    ],
    tipsEn: [
      "Green ↓ arrow = Money coming IN (Invoice/Revenue)",
      "Red ↑ arrow = Money going OUT (Expense/Salary)",
      "Update bank balances monthly when you receive bank statements",
      "Use date range filter to view specific period cash flow",
      "Negative cash flow (red) means outflows exceed inflows - review expenses"
    ],
    tipsHi: [
      "हरा ↓ तीर = पैसा आ रहा है (इनवॉइस/राजस्व)",
      "लाल ↑ तीर = पैसा जा रहा है (खर्च/वेतन)",
      "जब आपको बैंक स्टेटमेंट मिले तो मासिक बैंक शेष अपडेट करें",
      "विशिष्ट अवधि के कैश फ्लो को देखने के लिए तिथि सीमा फ़िल्टर का उपयोग करें",
      "नकारात्मक कैश फ्लो (लाल) का मतलब है कि आउटफ्लो इनफ्लो से अधिक है - खर्चों की समीक्षा करें"
    ]
  }
}
