const Joi = require('joi');
const { DEVICE_TYPE } = require('../constant/common');

const addCustomControls = Joi.object({
  ropa_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null, "").optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const questionnaies = Joi.object({
  industry_vertical_id: Joi.number().required(),
  page: Joi.number().optional(),
  size: Joi.number().optional()
})

const updateCustomControls = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').optional(),
  is_attachment: Joi.boolean().optional(),
  question: Joi.string().optional(),
  fields: Joi.array().items(Joi.object()).optional(),
})

const updateFields = Joi.object({
  fields: Joi.array().items(Joi.object()).required(),
})

const createPolicy = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  recurrence: Joi.string().valid('ANNUALLY', 'BI_ANNUALLY', 'QUATERLY', 'MONTHLY', 'NEVER').optional(),
  status: Joi.string().valid('CREATION_OF_POLICY', 'APPROVAL_OF_POLICY', 'REVIEW_OF_POLICY', 'POLICY_IN_USE').optional(),
  language: Joi.string().required(),
  department_id: Joi.number().required(),
  entity_id: Joi.number().required(),
  category_id: Joi.number().required(),
  relevant_law_id: Joi.array().items(Joi.number()).required(),
  author_id: Joi.number().required(),
  approver_id: Joi.number().required(),
  reviewer_id: Joi.array().items(Joi.number()).required(),
  policy_id: Joi.string().required(),
  version_no: Joi.number().optional,
  effective_date: Joi.date().required(),
  tentative_date: Joi.date().required()
})

const updatePolicy = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  recurrence: Joi.string().valid('ANNUALLY', 'BI_ANNUALLY', 'QUATERLY', 'MONTHLY', 'NEVER').optional(),
  status: Joi.string().valid('CREATION_OF_POLICY', 'APPROVAL_OF_POLICY', 'REVIEW_OF_POLICY', 'POLICY_IN_USE').optional(),
  department_id: Joi.number().optional(),
  entity_id: Joi.number().optional(),
  author_id: Joi.number().optional(),
  approver_id: Joi.number().optional(),
  reviewer_id: Joi.array().items(Joi.number()).optional()
})

const updateReview = Joi.object({
  result: Joi.string().valid('APPROVED', 'REJECTED', 'PENDING').optional(),
  comment: Joi.string().optional(),
  review_date: Joi.date().optional(),
  status: Joi.string().valid('CREATION_OF_POLICY', 'APPROVAL_OF_POLICY', 'REVIEW_OF_POLICY', 'POLICY_IN_USE').required()
})

const dashboard = Joi.object({
  deapartment_ids: Joi.array().items(Joi.number()).required(),
})

const department = Joi.object({
  name: Joi.string().required(),
  spoc_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  group_id: Joi.number().required(),
  parent_id: Joi.number().allow(null).min(1).required()

})

const updateDepartment = Joi.object({
  name: Joi.string().required(),
  spoc_id: Joi.number().optional(),
})


const process = Joi.object({
  name: Joi.string().required(),
  spoc_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  department_id: Joi.number().required(),
  parent_id: Joi.number().allow(null).min(1).required()

})

const updateProcess = Joi.object({
  name: Joi.string().required(),
  spoc_id: Joi.number().optional(),

})

const createAnswers = Joi.object({
  ropa_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignRopa = Joi.object({
  ropa_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewROPA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).optional(),
    comments: Joi.string().allow(null, "").optional(),
  })).optional(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().optional(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).optional()

})

const answerBasicInfo = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    ropa_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaborator = Joi.object({
  ropa_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const createAnswersLia = Joi.object({
  lia_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignLia = Joi.object({
  lia_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewLIA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    comments: Joi.string().optional(),
  })).required()
})

const addCollaboratorLia = Joi.object({
  lia_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsLia = Joi.object({
  lia_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const createAnswersTia = Joi.object({
  tia_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignTia = Joi.object({
  tia_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewTIA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    comments: Joi.string().optional(),
  })).required()
})

const answerBasicInfoTia = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    tia_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaboratorTia = Joi.object({
  tia_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsTia = Joi.object({
  tia_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const createAnswersPia = Joi.object({
  pia_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignPia = Joi.object({
  pia_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewPIA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    comments: Joi.string().optional(),
  })).required()
})

const answerBasicInfoPia = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    pia_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaboratorPia = Joi.object({
  pia_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsPia = Joi.object({
  pia_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const createAnswersPda = Joi.object({
  pda_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignPda = Joi.object({
  pda_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewPDA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    comments: Joi.string().optional(),
  })).required()
})

const answerBasicInfoPda = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    pda_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaboratorPda = Joi.object({
  pda_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsPda = Joi.object({
  pda_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const deleteDocumentFromS3 = Joi.object({
  url: Joi.string().required(),
  key: Joi.string().valid('via', 'vea', 'veaMitigation', 'lia', 'tia', 'pia', 'pda', 'ropa' ).required()
})

const getPolicyList = Joi.object({
  entity_id: Joi.number().required()
})

const startPolicyCreation = Joi.object({
  policy_id: Joi.number().required()
})

const savePolicy = Joi.object({
  content: Joi.object().required(),
  name: Joi.string().optional()
})

const submitPolicy = Joi.object({
  json_content: Joi.object().required(),
  html_content: Joi.string().required(),
  name: Joi.string().optional()
})

const policyCreationAI = Joi.object({
  policy_id: Joi.number().required(),
  text: Joi.string().required(),
  policy_text: Joi.string().required()
})

const policyCreationCustomPrompt = Joi.object({
  policy_id: Joi.number().required(),
  text: Joi.string().allow("", null).optional(),
  prompt: Joi.string().required(),
  policy_text: Joi.string().allow("", null).required()
})

const createAssessments = Joi.object({
  assessment_id: Joi.number().required(),
  entity_id: Joi.number().required(),
  department_id: Joi.number().optional(),
  process_id: Joi.number().optional(),
  assigned_to: Joi.number().required(),
  reviewer_id: Joi.number().optional(),
  tentative_date: Joi.date().required(),
  status: Joi.string().valid('Yet to Start', 'Started', 'Under Review', 'Changes Requested', 'Completed').optional()
})

const updateAssessments = Joi.object({
  tentative_date: Joi.date().optional()
})

const createVendor = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(15).empty('').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
  address: Joi.string().optional(),
  vendor_name: Joi.string().empty('').optional(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional()
})

const addVendor = Joi.object({
  vendor_id: Joi.number().required(), // customr vendor mapping id
  group_id: Joi.number().required(),
  department_id:Joi.number().required(),
  reviewer_id: Joi.number().required(),
  assigned_to: Joi.number().required(),
  vpoc_id: Joi.number().required(),
  template_id: Joi.number().optional()
})

const updateVendor = Joi.object({
  description: Joi.string().allow(null, '').required(),
  status: Joi.string().valid('active', 'inactive', 'archived').default('active'),
  stage: Joi.string().valid('CREATE', 'INTERNAL_ASSESSMENT', 'VENDOR_ASSESSMENT', 'COMPLETED', 'MITIGATION').required(),
  reminder_date: Joi.date().allow(null).optional(),
  next_review: Joi.date().allow(null).optional(),
  completion_date: Joi.date().allow(null).optional(),
  type_id: Joi.number().required()
});


const createAnswersVia = Joi.object({
  via_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignVia = Joi.object({
  via_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewVIA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    comments: Joi.string().optional(),
  })).required()
})

const answerBasicInfoVia = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    via_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaboratorVia = Joi.object({
  via_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsVia = Joi.object({
  via_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

const createAnswersVea = Joi.object({
  vea_id: Joi.number().required(),
  answers: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required(),
    attachment_link: Joi.string().allow(null, "").optional(),
    raw_url: Joi.boolean().allow(null).optional(),
    extra_answer: Joi.array().optional()
  })).required()
})

const assignVea = Joi.object({
  vea_id: Joi.number().required(),
  user_id: Joi.number().required()
})

const reviewVEA = Joi.object({
  reviews: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    accurate_information: Joi.number().valid(0, 1).required(),
    risk_score: Joi.number().required(),
    comments: Joi.string().optional(),
  })).required()
})

const answerBasicInfoVea = Joi.object({
  answers: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    vea_id: Joi.number().required(),
    type: Joi.string().valid('add', 'update').required(),
    answer: Joi.array().required()
  })).required()
})

const addCollaboratorVea = Joi.object({
  vea_id: Joi.number().required(),
  collaborators: Joi.array().items(Joi.object({
    users: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      action: Joi.string().valid('add', 'remove').required()
    })).required(),
    category_id: Joi.number().required()
  })).required()
})

const addCustomControlsVea = Joi.object({
  vea_id: Joi.number().required(),
  category_id: Joi.number().required(),
  title: Joi.string().allow(null).optional(),
  description: Joi.string().allow(null).optional(),
  artifact_type: Joi.string().valid('select', 'radio', 'textarea', 'input', 'checkbox').required(),
  is_attachment: Joi.boolean().required(),
  question: Joi.string().allow(null, "").optional(),
  fields: Joi.array().items(Joi.object()).allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  extra_input: Joi.boolean().required(),
  extra_input_type: Joi.string().allow(null).optional(),
  extra_input_fields: Joi.array().items(Joi.object()).allow(null).optional()
})

// core

const getLogin = Joi.object({
  logo: Joi.string().optional(),
  primary_color: Joi.string().optional(),
  secondary_color: Joi.string().optional(),
  show_create_account: Joi.boolean().optional(),
  show_forgot_password: Joi.boolean().optional()
});

const getSignup = Joi.object({
  logo: Joi.string().optional(),
  primary_color: Joi.string().optional(),
  secondary_color: Joi.string().optional(),
  show_login: Joi.boolean().optional()
});

const getPage = Joi.object({
  logo: Joi.string().optional(),
  primary_color: Joi.string().optional(),
  secondary_color: Joi.string().optional()
});

const createClientSchema = Joi.object({
  client_name: Joi.string().required(),
  domain_name: Joi.string().required(),
  ip_address: Joi.string().ip().required(),
  status: Joi.string().valid('active', 'inactive', 'pending').required()
});

const validateUser = Joi.object({
  access_token: Joi.string().required(),
});

const checkEmail = Joi.object({
  email: Joi.string().email().required()
});

const login = Joi.object({
  device_id: Joi.string().optional(),
  device_token: Joi.string().optional(),
  device_type: Joi.string().required(),
  mpin: Joi.string().optional(),
  // web
  mpin: Joi.when('device_type', {
    is: Joi.number().valid(DEVICE_TYPE.MPIN_ANDROID, DEVICE_TYPE.MPIN_IOS),
    then: Joi.string().trim().required()
  }),
  email: Joi.when('device_type', {
    is: Joi.number().valid(DEVICE_TYPE.WEB, DEVICE_TYPE.IOS, DEVICE_TYPE.ANDRIOD),
    then: Joi.string().email().required()
  }),
  password: Joi.when('device_type', {
    is: Joi.number().valid(DEVICE_TYPE.WEB, DEVICE_TYPE.IOS, DEVICE_TYPE.ANDRIOD),
    then: Joi.string().trim().required()
  })
});

const signUp = Joi.object({
  email: Joi.string().email().required(),
  //  phone: Joi.string().required(),
  phone: Joi.string().min(6).max(15).empty('').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
});

const updatePassword = Joi.object({
  email: Joi.string().email().required(),
  //  phone: Joi.string().required(),
  password: Joi.string().empty('').required(),
});

const resetPassword = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
  confirm_password: Joi.string().valid(Joi.ref('password')),
  // accessKey: Joi.string().required(),
});

const changePassword = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required(),
});

const verifyOtp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  forgot_type: Joi.string().valid('MPIN', 'WEB').optional()
})

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
  forgot_type: Joi.string().valid('MPIN', 'WEB').optional()
})

const generateAccessToken = Joi.object({
  refresh_token: Joi.string().required(),
})

const createCustomer = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(15).empty('').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
  address: Joi.string().optional(),
  customer_name: Joi.string().empty('').optional(),
  resource_list: Joi.array().items(Joi.number()).required(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
})

const updateCustomer = Joi.object({
  phone: Joi.string().min(6).max(15).empty('').optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
  address: Joi.string().optional(),
  customer_name: Joi.string().empty('').optional(),
  user_id: Joi.number().required(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  //resource_list: Joi.array().items(Joi.number()).optional()
  resource_list: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    type: Joi.string().required()
  })).optional()
})

const createUser = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(15).empty('').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
  group_access: Joi.array().items(Joi.number()).optional(),
  role_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  resource_list: Joi.array().items(Joi.number()).min(1).required()
})

const updateUser = Joi.object({
  phone: Joi.string().min(6).max(15).empty('').optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().empty('').optional(),
  country_code: Joi.string().max(4).optional(),
  group_access: Joi.array().items(Joi.number()).optional(),
  role_id: Joi.number().optional(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional()
})

const updateProfile = Joi.object({
  phone: Joi.string().min(6).max(15).empty('').optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().empty('').optional(),
  profile_image: Joi.string()  // Assuming profile_image is a string field
    .optional()  // Make the field optional
    .allow(null) // Allow null values
    .max(255)    // Example: Add additional validations as needed
    .uri()
})

const getUserList = Joi.object({
  customer_id: Joi.number().required(),
  page: Joi.number().optional(),
  size: Joi.number().optional(),
  search: Joi.string().optional(),
  sort_by: Joi.string().optional(),
  sort_order: Joi.string().optional(),
  start_date: Joi.date().iso().optional(), // Validating start date in ISO format (optional)
  end_date: Joi.date().iso().optional()

})

const getRoleUsers = Joi.object({
  role_id: Joi.number().required(),
  page: Joi.number().required(),
  size: Joi.number().required(),
  search: Joi.string().optional(),
  sort_by: Joi.string().optional(),
  sort_order: Joi.string().optional(),
  start_date: Joi.date().iso().optional(), // Validating start date in ISO format (optional)
  end_date: Joi.date().iso().optional()

})

const assignRole = Joi.object({
  role_id: Joi.number().required(),
  check: Joi.array().items(Joi.number()).required(),
  uncheck: Joi.array().items(Joi.number()).required()
});

const createOrganisation = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  business_size: Joi.string().required(),
  industry_vertical: Joi.number().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required(),
  country: Joi.string().optional()
});

const onboarding = Joi.object({
  service_id: Joi.array().items(Joi.number()).required(),
  ambition_id: Joi.array().items(Joi.number()).required(),
  package_id: Joi.number().required(),
  questionnaires: Joi.array().items(Joi.object({
    question_id: Joi.number().required(),
    status: Joi.boolean().required()
  })).required()
});

// const questionnaies = Joi.object({
//   ambition_id: Joi.array().items(Joi.number()).required(),
//   page: Joi.number().optional(),
//   size: Joi.number().optional()
// })

const createRole = Joi.object({
  role_name: Joi.string().required(),
  customer_id: Joi.number().required(),
  resource_list: Joi.array().items(Joi.number()).required()
})

const updateRole = Joi.object({
  role_name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  resource_list: Joi.array().items(Joi.object()).optional()
})

const getTable = Joi.object({
  data: Joi.array().required(),
  columns: Joi.array().required(),
  size: Joi.number().required(),
  page: Joi.number().required(),
  search_key: Joi.string().optional(),
  sort_by: Joi.array().optional()
});

const createGroup = Joi.object({
  name: Joi.string().required(),
  customer_id: Joi.number().required(),
  spoc_id: Joi.number().optional(),
  user_id: Joi.number().required(),
  parent_id: Joi.number().optional()
})

const editGroup = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  parent_id: Joi.number().optional(),
  spoc_id: Joi.number().optional(),
})

const businessUnit = Joi.object({
  name: Joi.string().required(),
  customer_id: Joi.number().required(),
  user_id: Joi.number().optional(),
  parent_id: Joi.number().optional(),
  spoc_id: Joi.number().optional()

})
// Support and Ticket Module
const createTicket = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  assignee_id: Joi.number().required(),
  department_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  type: Joi.string().valid('OTHER', 'FEEDBACK', 'SUPPORT', 'ISSUE', 'CHANGE_REQUEST').required(),
  status: Joi.string().valid('OPEN', 'CLOSE', 'IN_PROGRESS').required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').required()
  // isDocument: Joi.boolean().required()
})
const updateTicket = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  assignee_id: Joi.number().optional(),
  department_id: Joi.number().optional(),
  customer_id: Joi.number().optional(),
  type: Joi.string().valid('OTHER', 'FEEDBACK', 'SUPPORT', 'ISSUE', 'CHANGE_REQUEST').optional(),
  status: Joi.string().valid('OPEN', 'CLOSE', 'IN_PROGRESS').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional()
  // isDocument: Joi.boolean().required()
})

const createComment = Joi.object({
  ticket_id: Joi.number().required(),
  comment: Joi.string().required()
})


// const submitPolicy = Joi.object({
//   json_content: Joi.object().required(),
//   html_content: Joi.string().required(),
//   name: Joi.string().optional()
// })
const mitigationVEA = Joi.object({
  mitigation: Joi.array().items(Joi.object({
    customer_question_id: Joi.number().required(),
    mitigation_plan: Joi.object().required(),
    attachment: Joi.string().optional(),
    risk_score: Joi.number().optional()
  })).required()
})

module.exports = {
  addCustomControls,
  updateCustomControls,
  questionnaies,
  createPolicy,
  updatePolicy,
  updateReview,
  dashboard,
  department,
  updateDepartment,
  process,
  updateProcess,
  createAnswers,
  assignRopa,
  reviewROPA,
  answerBasicInfo,
  addCollaborator,
  deleteDocumentFromS3,
  getPolicyList,
  updateFields,
  createAnswersLia,
  assignLia,
  reviewLIA,
  addCollaboratorLia,
  addCustomControlsLia,
  createAnswersTia,
  assignTia,
  reviewTIA,
  answerBasicInfoTia,
  addCollaboratorTia,
  addCustomControlsTia,
  createAnswersPia,
  assignPia,
  reviewPIA,
  answerBasicInfoPia,
  addCollaboratorPia,
  addCustomControlsPia,
  createAnswersPda,
  assignPda,
  reviewPDA,
  answerBasicInfoPda,
  addCollaboratorPda,
  addCustomControlsPda,
  startPolicyCreation,
  policyCreationAI,
  policyCreationCustomPrompt,
  savePolicy,
  submitPolicy,
  createAssessments,
  updateAssessments,
  createVendor,
  addVendor,
  updateVendor,
  createAnswersVia,
  assignVia,
  reviewVIA,
  answerBasicInfoVia,
  addCollaboratorVia,
  addCustomControlsVia,
  createAnswersVea,
  assignVea,
  reviewVEA,
  answerBasicInfoVea,
  addCollaboratorVea,
  addCustomControlsVea,
  // core
  getLogin,
  createClientSchema,
  login,
  getSignup,
  signUp,
  checkEmail,
  getPage,
  verifyOtp,
  changePassword,
  forgotPassword,
  updatePassword,
  resetPassword,
  createUser,
  updateUser,
  createCustomer,
  updateCustomer,
  getUserList,
  createOrganisation,
  onboarding,
  createRole,
  updateRole,
  getTable,
  generateAccessToken,
  getRoleUsers,
  assignRole,
  createGroup,
  editGroup,
  businessUnit,
  updateProfile,
  createTicket,
  updateTicket,
  createComment,
  validateUser,
  mitigationVEA
};
