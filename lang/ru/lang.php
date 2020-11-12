<?php

return [
    'details' => [
        'name' => 'Toolbox',
        'description' => 'Плагин Toolbox для October CMS',
        'author' => 'Prismify',
    ],
    'controllers' => [
        'all' => [
            'filter' => [
                'created_at' => [
                    'label' => 'Дата создания'
                ],
                'updated_at' => [
                    'label' => 'Дата изменеия'
                ],
                'enabled_at' => [
                    'label' => 'Дата включения'
                ],
                'deleted_at' => [
                    'label' => 'Дата удаления'
                ],
            ]
        ]
    ],
    'models' => [
        'all' => [
            'columns' => [
                'created_at' => [
                    'label' => 'Дата создания'
                ],
                'updated_at' => [
                    'label' => 'Дата изменеия'
                ],
                'enabled_at' => [
                    'label' => 'Дата включения'
                ],
                'deleted_at' => [
                    'label' => 'Дата удаления'
                ],
            ],
            'fields' => [
                'is_enabled' => [
                    'label' => 'Включено'
                ],
                'enabled_at' => [
                    'label' => 'Включить в',
                    'validation' => 'Пожалуйста укажите дату включения'
                ]
            ]
        ]
    ]
];