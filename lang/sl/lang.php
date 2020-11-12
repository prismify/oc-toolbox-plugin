<?php

return [
    'details' => [
        'name' => 'Toolbox',
        'description' => 'Toolbox vtičnik za October CMS',
        'author' => 'Prismify',
    ],
    'controllers' => [
        'all' => [
            'filter' => [
                'created_at' => [
                    'label' => 'Datum ustvarjanja'
                ],
                'updated_at' => [
                    'label' => 'Datum posodobljen'
                ],
                'enabled_at' => [
                    'label' => 'Datum omogočen'
                ],
                'deleted_at' => [
                    'label' => 'Datum izbrisa'
                ],
            ]
        ]
    ],
    'models' => [
        'all' => [
            'columns' => [
                'created_at' => [
                    'label' => 'Datum ustvarjanja'
                ],
                'updated_at' => [
                    'label' => 'Datum posodobljen'
                ],
                'enabled_at' => [
                    'label' => 'Datum omogočen'
                ],
                'deleted_at' => [
                    'label' => 'Datum izbrisa'
                ],
            ],
            'fields' => [
                'is_enabled' => [
                    'label' => 'Je omogočeno'
                ],
                'enabled_at' => [
                    'label' => 'Omogočeno dne',
                    'validation' => 'Prosimo vpišite datum objave'
                ]
            ]
        ]
    ],
    'traits' => [
        'component_utilities' => [
            'lookup_user' => [
                'exception' => 'Morate biti prijavljeni'
            ]
        ]
    ]
];