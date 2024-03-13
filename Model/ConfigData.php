<?php

declare(strict_types=1);

namespace Thecommerceshop\Predictivesearch\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class ConfigData
{
    /**
     * Search Enable Status
     */
    private const IS_ENABLED = 'typesense_general/credentials/enable_frontend';

    /**
     * Host
     */
    private const HOST = 'typesense_general/credentials/host';

    /**
     * Search Only Api Key
     */
    private const SEARCH_API_KEY = 'typesense_general/credentials/search_only_api_key';

    /**
     * Admin Api Key
     */
    private const ADMIN_API_KEY = 'typesense_general/credentials/admin_api_key';

    /**
     * Index Prefix
     */
    private const INDEX_PERFIX = 'typesense_general/credentials/index_prefix';

    /**
     * Protocol
     */
    private const PROTOCOL = 'typesense_general/credentials/protocol';

    /**
     * Port
     */
    private const PORT = 'typesense_general/credentials/port';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfigInterface;

    /**
     * Config Data Provider
     *
     * @param ScopeConfigInterface $scopeConfigInterface
     * @param General $generalModel
     */
    public function __construct(
        ScopeConfigInterface $scopeConfigInterface,
    ) {
        $this->scopeConfigInterface = $scopeConfigInterface;
    }

    /**
     * Get Module Status
     *
     * @param void
     * @return string
     */
    public function getModuleStatus()
    {
        return $this->getSystemConfigValues(self::IS_ENABLED);
    }

    /**
     * Get Cloud Key
     *
     * @param void
     * @return string
     */
    public function getHost()
    {
        return $this->getSystemConfigValues(self::HOST);
    }

    /**
     * Get Search Api Key
     *
     * @param void
     * @return string
     */
    public function getSearchApiKey()
    {
        return $this->getSystemConfigValues(self::SEARCH_API_KEY);
    }

    /**
     * Get Admin Api Key
     *
     * @param void
     * @return string
     */
    public function getAdminApiKey()
    {
        return $this->getSystemConfigValues(self::ADMIN_API_KEY);
    }

    /**
     * Get Index Prefix
     *
     * @param void
     * @return string
     */
    public function getIndexPrefix()
    {
        return $this->getSystemConfigValues(self::INDEX_PERFIX);
    }

    /**
     * Get Protocol
     *
     * @param void
     * @return string
     */
    public function getProtocol()
    {
        return $this->getSystemConfigValues(self::PROTOCOL);
    }

    /**
     * Get Port
     *
     * @param void
     * @return string
     */
    public function getPort()
    {
        return $this->getSystemConfigValues(self::PORT);
    }

    /**
     * Get System config values
     *
     * @param string $configPath
     */
    public function getSystemConfigValues($configPath)
    {
        return $this->scopeConfigInterface->getValue($configPath, ScopeInterface::SCOPE_STORE);
    }
}
