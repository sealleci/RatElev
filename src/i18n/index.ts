import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUI from './locales/en/ui.json'
import ruUI from './locales/ru/ui.json'
import zhCNUI from './locales/zh-CN/ui.json'

export const i18n = createInstance()

export const i18nReady = i18n.use(initReactI18next).init({
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    supportedLngs: ['zh-CN', 'en', 'ru'],
    defaultNS: 'ui',
    resources: {
        'zh-CN': {
            ui: zhCNUI
        },
        en: {
            ui: enUI
        },
        ru: {
            ui: ruUI
        }
    },
    interpolation: {
        escapeValue: false
    }
})
