import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
} from "@chakra-ui/react";
import { useGoals } from "../context/GoalContext";

export default function GoalForm() {
  const { t } = useTranslation();
  const { addGoal } = useGoals();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    addGoal({
      name: data.name.trim(),
      target: parseFloat(data.target),
      current: parseFloat(data.current || 0),
    });
    reset();
  };

  return (
    <CardRoot mb={4}>
      <CardBody>
        <Heading size="md" mb={4}>
          {t("addGoal")}
        </Heading>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            <FieldRoot invalid={!!errors.name}>
              <FieldLabel>{t("goalName")}</FieldLabel>
              <Input
                placeholder={t("placeholderGoalName")}
                {...register("name", { required: t("required") })}
              />
              <FieldErrorText>{errors.name?.message}</FieldErrorText>
            </FieldRoot>

            <FieldRoot invalid={!!errors.target}>
              <FieldLabel>{t("targetAmount")}</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                {...register("target", {
                  required: t("required"),
                  validate: (v) => parseFloat(v) > 0 || t("invalidNumber"),
                })}
              />
              <FieldErrorText>{errors.target?.message}</FieldErrorText>
            </FieldRoot>

            <FieldRoot invalid={!!errors.current}>
              <FieldLabel>{t("currentAmount")}</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                defaultValue="0"
                {...register("current", {
                  validate: (v) => !v || parseFloat(v) >= 0 || t("invalidNumber"),
                })}
              />
              <FieldErrorText>{errors.current?.message}</FieldErrorText>
            </FieldRoot>

            <Button type="submit" colorScheme="blue" loading={isSubmitting} alignSelf="flex-start">
              {t("save")}
            </Button>
          </Stack>
        </Box>
      </CardBody>
    </CardRoot>
  );
}
