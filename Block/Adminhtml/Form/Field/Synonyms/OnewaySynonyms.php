<?php

declare(strict_types=1);

namespace Thecommerceshop\Predictivesearch\Block\Adminhtml\Form\Field\Synonyms;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;

class OnewaySynonyms extends AbstractFieldArray
{
    /**
     * Prepare rendering the new field by adding all the needed columns
     */
    protected function _prepareToRender()
    {
        $this->addColumn('input', [
            'label' => __('Input'),
            'class' => 'required-entry'
        ]);
        $this->addColumn('oneWaySynonyms', [
            'label' => __('Synonyms (comma-separated)'),
            'class' => 'required-entry'
        ]);
        $this->_addAfter = false;
        $this->_addButtonLabel = __('Add');
    }
}
