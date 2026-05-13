import {
  Box,
  Flex,
  Heading,
  NativeSelectRoot,
  NativeSelectField,
  Text,
  CardRoot,
  CardBody,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useGoals } from '../context/GoalContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { goals, transactions } = useGoals();

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const txTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const goalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const totalSaved = Math.max(txTotal, goalCurrent);

  const locales = [
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
    { key: 'zh', label: '中文' },
  ];

  return (
    <Box mb={6}>
      <Flex
        align="center"
        justify="space-between"
        mb={4}
        gap={4}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Heading size="lg">{t('appTitle')}</Heading>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" color="textMuted">
            {t('language')}:
          </Text>
          <NativeSelectRoot size="sm" width="140px">
            <NativeSelectField
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              {locales.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Flex>
      </Flex>

      <Flex gap={3}>
        <CardRoot flex={1}>
          <CardBody textAlign="center">
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="wide"
              color="textMuted"
              mb={1}
            >
              {t('totalSaved')}
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {t('currency', { value: totalSaved.toFixed(2) })}
            </Text>
          </CardBody>
        </CardRoot>
        <CardRoot flex={1}>
          <CardBody textAlign="center">
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="wide"
              color="textMuted"
              mb={1}
            >
              {t('totalTarget')}
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {t('currency', { value: totalTarget.toFixed(2) })}
            </Text>
          </CardBody>
        </CardRoot>
      </Flex>
    </Box>
  );
}
