<?php namespace Prismify\Toolbox\Behaviors;

use Backend\Classes\Controller;
use Backend\Classes\ControllerBehavior;

class PopupController extends ControllerBehavior
{
    /**
     * @var Controller
     */
    protected $controller;

    /**
     * Behavior constructor
     *
     * @param   Controller  $controller
     */
    public function __construct($controller){

        parent::__construct($controller);

        $this->controller = $controller;

        $this->setConfig($controller->listConfig, ['modelClass']);
    }

    public function onCreateForm()
    {
        $this->controller->asExtension('FormController')->create(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');
        return $this->controller->makePartial('$/prismify/toolbox/partials/modals/_create.htm');
    }

    public function onCreateItem()
    {
        $this->controller->asExtension('FormController')->create_onSave();
        $model = $this->controller->asExtension('FormController')->formCreateModelObject();
        return $this->controller->listRefresh();
    }

    public function onUpdateForm()
    {
        $this->controller->asExtension('FormController')->update(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');
        return $this->controller->makePartial('$/prismify/toolbox/partials/modals/_update.htm');
    }

    public function onUpdateItem()
    {
        $this->controller->asExtension('FormController')->update_onSave(post('record_id'));
        return $this->controller->listRefresh();
    }

    public function onPreviewForm()
    {
        $this->controller->asExtension('FormController')->preview(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');
        return $this->controller->makePartial('$/prismify/toolbox/partials/modals/_preview.htm');
    }

    public function onDeleteItem()
    {
        $this->controller->asExtension('FormController')->update_onDelete(post('record_id'));
        return $this->controller->listRefresh();
    }
}