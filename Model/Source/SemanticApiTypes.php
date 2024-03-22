<?php
/**
 * @package Ceymox_TypesenseSearch
 * @author  Ceymox Technologies Pvt. Ltd.
 */
declare(strict_types=1);

namespace Thecommerceshop\Predictivesearch\Model\Source;

use Magento\Framework\Option\ArrayInterface;

class SemanticApiTypes implements ArrayInterface
{
    /**
     * To Option Array
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => '',         'label' => __('Select Integration Types')],
            ['value' => 1, 'label' => __('S-BERT')],
            ['value' => 2, 'label' => __('GTE')],
            ['value' => 3, 'label' => __('E-5')],
            ['value' => 4, 'label' => __('Open AI')],
            ['value' => 5, 'label' => __('MPNET')],
            ['value' => 6, 'label' => __('PaLM')],
            ['value' => 7, 'label' => __('VertexAi')],
        ];
    }
}
