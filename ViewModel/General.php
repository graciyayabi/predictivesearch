<?php

declare(strict_types=1);

namespace Thecommerceshop\Predictivesearch\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Thecommerceshop\Predictivesearch\Model\ConfigData;

class General implements ArgumentInterface
{
    /**
     * @var ConfigData
     */
    private $configData;

    /**
     * ViewModel constructor
     *
     * @param ConfigData $configData
     */
    public function __construct(
        ConfigData $configData
    ) {
        $this->configData = $configData;
    }

    /**
     * Price slider status
     *
     * @param void
     * @return bool
     */
    public function priceSlider()
    {
        return $this->configData->enableSlider();
    }
}
