<?php namespace Prismify\Toolbox\Traits\Utilities;

use Auth;
use Input;
use System\Models\File as AttachmentModel;
use ApplicationException;

trait ComponentUtilities
{
    protected $objectLookupCache = [];
    protected $modelLoadCache = [];
    protected $modelLoadSecureCache = [];
    protected $modelLookupCache = [];
    protected $modelLookupSecureCache = [];

    protected function lookupObject($code, $value)
    {
        if ($object = array_get($this->objectLookupCache, $code)) {
            return $object;
        }

        if (is_callable($value)) {
            $value = $value();
        }

        return $this->objectLookupCache[$code] = $value;
    }

    protected function lookupUser()
    {
        if (!$user = Auth::getUser()) {
            throw new ApplicationException('prismify.toolbox::lang.traits.component_utilities.lookup_user.exception');
        }

        return $user;
    }

    /**
     * Loads a model from the page properties.
     * - slug
     */
    protected function loadModel($class, $scope = null, $init = null)
    {
        if (is_string($class)) {
            $query = new $class;
        } else {
            $query = $class;
            $class = get_class($class);
        }

        if ($model = array_get($this->modelLoadCache, $class)) {
            return $model;
        }

        if (!$slug = $this->property('slug')) {
            return null;
        }

        if (is_callable($scope)) {
            $scope($query);
        }

        $model = $query->whereSlug($slug)->first();

        if ($model && is_callable($init) && $init($model) === false) {
            return false;
        }

        return $this->modelLoadCache[$class] = $model;
    }

    protected function loadModelSecure($class, $user = null, $scope = null, $init = null)
    {
        if (is_string($class)) {
            $query = new $class;
        } else {
            $query = $class;
            $class = get_class($class);
        }

        if ($model = array_get($this->modelLoadSecureCache, $class)) {
            return $model;
        }

        if (!$slug = $this->property('slug')) {
            return null;
        }

        if (is_callable($scope)) {
            $scope($query);
        }

        if (!$model = $query->whereSlug($slug)->first()) {
            return false;
        }

        if (!$model->canEdit($user)) {
            return false;
        }

        if ($model && is_callable($init) && $init($model) === false) {
            return false;
        }

        return $this->modelLoadSecureCache[$class] = $model;
    }

    /**
     * Loads a model from a postback variable.
     * - id
     */
    protected function lookupModel($class, $scope = null, $init = null)
    {
        if (is_string($class)) {
            $query = new $class;
        } else {
            $query = $class;
            $class = get_class($class);
        }

        if ($model = array_get($this->modelLookupCache, $class)) {
            return $model;
        }

        if (!$id = post('id')) {
            return null;
        }

        if (is_callable($scope)) {
            $scope($query);
        }

        if (!$model = $query->find($id)) {
            return null;
        }

        if ($model && is_callable($init) && $init($model) === false) {
            return false;
        }

        return $this->modelLookupCache[$class] = $model;
    }

    protected function lookupModelSecure($class, $user = null, $scope = null, $init = null)
    {
        if (is_string($class)) {
            $query = new $class;
        } else {
            $query = $class;
            $class = get_class($class);
        }

        if ($model = array_get($this->modelLookupSecureCache, $class)) {
            return $model;
        }

        if (!$id = post('id')) {
            return null;
        }

        if (is_callable($scope)) {
            $scope($query);
        }

        if (!$model = $query->find($id)) {
            return null;
        }

        if (!$model->canEdit($user)) {
            return false;
        }

        if ($model && is_callable($init) && $init($model) === false) {
            return false;
        }

        return $this->modelLookupSecureCache[$class] = $model;
    }

    protected function patchModel($model, $postData = null)
    {
        if (!$postData) {
            $postData = post();
        }

        $attributes = array_map('trim', explode(',', post('propertyName')));
        $data = array_where($postData, function($key, $value) use ($attributes) {
            return in_array($key, $attributes);
        });

        $model->rules = array_intersect_key($model->rules, array_flip($attributes));
        $model->fill($data);

        return $data;
    }

    protected function setAttachmentsOnModel($model, $sessionKey = null)
    {
        $fileData = Input::hasFile('attachments') ? (array) Input::file('attachments') : [];

        foreach ($fileData as $fileInfo) {
            try {
                if (!is_null($fileInfo)) {
                    $file = new AttachmentModel;
                    $file->data = $fileInfo;
                    $file->save();

                    $model->attachments()->add($file, $sessionKey);
                }
            } catch (Exception $ex) {
                // Do nothing
            }
        }
    }
}