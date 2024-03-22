<?php


declare(strict_types=1);

namespace Thecommerceshop\Predictivesearch\Block\Adminhtml\Form\Field\Products;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;
use Thecommerceshop\Predictivesearch\Block\Adminhtml\Form\Field\YesNo;
use Thecommerceshop\Predictivesearch\Block\Adminhtml\Form\Field\Products\Order;
use Thecommerceshop\Predictivesearch\Block\Adminhtml\Form\Field\Products\AttributeOptions;

class Attributes extends AbstractFieldArray
{
    /**
     * @var YesNo
     */
    private $yesno;

    /**
     * @var Order
     */
    private $orderType;

    /**
     * @var AttributeOptions
     */
    private $attributeOptions;

    /**
     * Prepare rendering the new field by adding all the needed columns
     */
    protected function _prepareToRender()
    {
        $this->addColumn('productAttribute', [
            'label' => __('Attribute'),
            'renderer' => $this->getAttributeRenderer()
        ]);
        $this->addColumn('searchable', [
            'label' => __('Searchable?'),
            'renderer' => $this->searchableRenderer()
        ]);
        
        $this->_addAfter = false;
        $this->_addButtonLabel = __('Add');
    }

    /**
     * Prepare existing row data object
     *
     * @param DataObject $row
     * @throws LocalizedException
     */
    protected function _prepareArrayRow(DataObject $row): void
    {
        $options = [];
        $type = $row->getSearchable() ? $row->getSearchable() : $row->getShowonCards() ;
        if ($type !== null) {
            $options['option_' . $this->searchableRenderer()->calcOptionHash($type)] = 'selected="selected"';
        }
    
        $productAttr = $row->getProductAttribute();
        if ($productAttr !== null) {
            $options['option_' . $this->getAttributeRenderer()->calcOptionHash($productAttr)] = 'selected="selected"';
        }
        $row->setData('option_extra_attrs', $options);
    }

    /**
     * SearchableRender
     *
     * @return YesNo
     * @throws LocalizedException
     */
    private function searchableRenderer()
    {
        if (!$this->yesno) {
            $this->yesno = $this->getLayout()->createBlock(
                YesNo::class,
                '',
                ['data' => ['is_render_to_js_template' => true]]
            );
        }
        return $this->yesno;
    }

    /**
     * Get Attribute Renderer
     *
     * @return AttributeOptions
     * @throws LocalizedException
     */
    private function getAttributeRenderer()
    {
        if (!$this->attributeOptions) {
            $this->attributeOptions = $this->getLayout()->createBlock(
                AttributeOptions::class,
                '',
                ['data' => ['is_render_to_js_template' => true]]
            );
        }
        return $this->attributeOptions;
    }
}
