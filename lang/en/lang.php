<?php

return [
    'details' => [
        'name' => 'Toolbox',
        'description' => 'Toolbox plugin for October CMS',
        'author' => 'Prismify',
    ],
    'controllers' => [
        'all' => [
            'filter' => [
                'created_at' => [
                    'label' => 'Created date'
                ],
                'updated_at' => [
                    'label' => 'Updated date'
                ],
                'enabled_at' => [
                    'label' => 'Enabled date'
                ],
                'deleted_at' => [
                    'label' => 'Deleted date'
                ],
            ]
        ]
    ],
    'models' => [
        'all' => [
            'columns' => [
                'created_at' => [
                    'label' => 'Created date'
                ],
                'updated_at' => [
                    'label' => 'Updated date'
                ],
                'enabled_at' => [
                    'label' => 'Enabled date'
                ],
                'deleted_at' => [
                    'label' => 'Deleted date'
                ],
            ],
            'fields' => [
                'is_enabled' => [
                    'label' => 'Enabled'
                ],
                'enabled_at' => [
                    'label' => 'Enabled on',
                    'validation' => 'Please specific enabled date'
                ]
            ]
        ]
    ],
    'traits' => [
        'component_utilities' => [
            'lookup_user' => [
                'exception' => 'You must be logged in'
            ]
        ]
    ]
];