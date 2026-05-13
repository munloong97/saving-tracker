import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CardRoot,
  CardBody,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useGoals } from '../context/GoalContext';

export default function TransactionForm({ goalId, onDone }) {
  const { t } = useTranslation();
  const { addTransaction } = useGoals();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data) => {
    addTransaction({
      goalId,
      amount: parseFloat(data.amount),
      date: data.date,
      note: data.note?.trim() || '',
    });
    reset({ date: new Date().toISOString().split('T')[0], amount: '', note: '' });
    onDone?.();
  };

  return (
    <CardRoot mt={3} borderStyle="dashed" borderWidth="1px" borderColor="primary">
      <CardBody>
        <Heading size="sm" mb={3}>{t('addTransaction')}</Heading>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={3}>
            <FieldRoot invalid={!!errors.amount}>
              <FieldLabel>{t('amount')}</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', {
                  required: t('required'),
                  validate: (v) => parseFloat(v) > 0 || t('invalidNumber'),
                })}
              />
              <FieldErrorText>{errors.amount?.message}</FieldErrorText>
            </FieldRoot>

            <FieldRoot invalid={!!errors.date}>
              <FieldLabel>{t('date')}</FieldLabel>
              <Input
                type="date"
                {...register('date', { required: t('required') })}
              />
              <FieldErrorText>{errors.date?.message}</FieldErrorText>
            </FieldRoot>

            <FieldRoot>
              <FieldLabel>{t('note')}</FieldLabel>
              <Input
                placeholder={t('placeholderNote')}
                {...register('note')}
              />
            </FieldRoot>

            <Stack direction="row" gap={2}>
              <Button type="submit" colorScheme="blue" size="sm" loading={isSubmitting}>
                {t('save')}
              </Button>
              {onDone && (
                <Button type="button" variant="ghost" size="sm" onClick={onDone}>
                  {t('cancel')}
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </CardBody>
    </CardRoot>
  );
}
