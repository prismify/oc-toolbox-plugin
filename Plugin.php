<?php namespace Prismify\Toolbox;

use Backend;
use System\Classes\CombineAssets;
use System\Classes\PluginBase;

/**
 * Toolbox Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'prismify.toolbox::lang.details.name',
            'description' => 'prismify.toolbox::lang.details.description',
            'author'      => 'prismify.toolbox::lang.details.author',
            'icon'        => 'icon-circle-thin',
            'homepage'    => 'https://github.com/prismify/oc-toolbox-plugin'
        ];
    }

    /**
     * Register method, called when the plugin is first registered.
     *
     * @return void
     */
    public function register()
    {
        /*
         * Register asset bundles
         */
        CombineAssets::registerCallback(function ($combiner) {
            $combiner->registerBundle('$/prismify/toolbox/assets/less/toolbox.less');
            $combiner->registerBundle('$/prismify/toolbox/assets/js/toolbox.js');
        });
    }

    /**
     * Boot method, called right before the request route.
     *
     * @return array
     */
    public function boot()
    {

    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return []; // Remove this line to activate

        return [
            'Prismify\Toolbox\Components\MyComponent' => 'myComponent',
        ];
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return []; // Remove this line to activate

        return [
            'prismify.toolbox.some_permission' => [
                'tab' => 'Toolbox',
                'label' => 'Some permission'
            ],
        ];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return []; // Remove this line to activate

        return [
            'toolbox' => [
                'label'       => 'Toolbox',
                'url'         => Backend::url('prismify/toolbox/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['prismify.toolbox.*'],
                'order'       => 500,
            ],
        ];
    }
}
