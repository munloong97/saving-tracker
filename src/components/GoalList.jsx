import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Box,
  Button,
  CardRoot,
  CardBody,
  Flex,
  HStack,
  Heading,
  IconButton,
  Text,
  Stack,
  ProgressRoot,
  ProgressTrack,
  ProgressRange,
} from "@chakra-ui/react";
import { Trash2, Pencil } from "lucide-react";
import { useGoals } from "../context/GoalContext";
import TransactionForm from "./TransactionForm";

export default function GoalList() {
  const { t } = useTranslation();
  const { goals, getGoalTransactions, deleteGoal } = useGoals();
  const [activeGoal, setActiveGoal] = useState(null);

  if (goals.length === 0) {
    return (
      <Box textAlign="center" py={10} color="textMuted">
        <Text>{t("noGoals")}</Text>
      </Box>
    );
  }

  return (
    <Stack gap={4}>
      {goals.map((goal) => {
        const pct = Math.min(100, (goal.current / goal.target) * 100);
        const goalTx = getGoalTransactions(goal.id);
        const isActive = activeGoal === goal.id;

        return (
          <CardRoot key={goal.id}>
            <CardBody>
              <Flex justify="space-between" align="start" mb={3}>
                <Box>
                  <Flex align="center" gap={2} mb={1}>
                    <Heading size="md">{goal.name}</Heading>
                    {pct >= 100 && (
                      <Badge colorScheme="green" fontSize="0.7em">
                        {t("completed")}
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="sm" color="textMuted">
                    {t("progress")}: {t("percent", { value: pct.toFixed(0) })}
                  </Text>
                </Box>
                <HStack gap={1}>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={t("editGoal")}
                    onClick={() => setActiveGoal(isActive ? null : goal.id)}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    aria-label={t("deleteGoal")}
                    onClick={() => {
                      if (window.confirm(t("confirmDelete"))) {
                        deleteGoal(goal.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </HStack>
              </Flex>

              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {t("currency", { value: goal.current.toFixed(2) })}{" "}
                <Text as="span" fontSize="sm" color="textMuted" fontWeight="normal">
                  / {t("currency", { value: goal.target.toFixed(2) })}
                </Text>
              </Text>

              <ProgressRoot value={pct} mb={3}>
                <ProgressTrack>
                  <ProgressRange />
                </ProgressTrack>
              </ProgressRoot>

              {!isActive && (
                <Button
                  size="sm"
                  variant="link"
                  colorScheme="blue"
                  onClick={() => setActiveGoal(goal.id)}
                >
                  {t("addTransaction")}
                </Button>
              )}

              {isActive && <TransactionForm goalId={goal.id} onDone={() => setActiveGoal(null)} />}

              {goalTx.length > 0 && (
                <Stack gap={1} mt={3} pt={3} borderTopWidth="1px" borderColor="border">
                  {goalTx.map((tx) => (
                    <Flex key={tx.id} justify="space-between" align="center" py={1} fontSize="sm">
                      <HStack gap={3}>
                        <Text fontSize="xs" color="textMuted">
                          {tx.date}
                        </Text>
                        <Text fontWeight="bold" color="success">
                          + {t("currency", { value: tx.amount.toFixed(2) })}
                        </Text>
                      </HStack>
                      {tx.note && (
                        <Text fontSize="xs" color="textMuted">
                          {tx.note}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </Stack>
              )}
            </CardBody>
          </CardRoot>
        );
      })}
    </Stack>
  );
}
