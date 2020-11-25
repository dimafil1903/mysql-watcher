module.exports =
    {
        "smtp": {
            auth: [
                "user",
                "pass",
                "host",
            ],
            message: {
                req: [
                    "title", "html", "text", "emailTo"
                ],
                optional:[
                    "emailFrom"
                ]
            }
        },
        "send_grid": {
            auth: [
                "api_key"
            ],
            message: {
                req: [
                    "title", "html", "text", "emailTo"
                ],
                optional:[
                    "emailFrom"
                ]
            }

        },
        'intel_tele': {
            auth: [
                "username",
                "api_key"
            ],
            message: {
                req: [
                    "number", "text"
                ],
                optional:[
                    "priority","system_type"
                ]
            }
        }
    }
