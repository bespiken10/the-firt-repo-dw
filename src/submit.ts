export async function submitFitAudit(formData: {
  totalScore: number;
  percent: number;
  pillarScores: {
    blocks: number;
    grading: number;
    tolerance: number;
    fabric: number;
    validation: number;
  };
  questionsAndAnswers: Array<{ question: string; answer: string; pillar: string }>;
  lead: { email: string; whatsapp: string };
}) {
  try {
    const response = await fetch(
      "https://bothook.io/v1/public/triggers/webhooks/341188b6-49ad-4252-9450-e94670d70a7e",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error(`Webhook submission failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Webhook submission error:", error);
    return { success: false, error: error.message };
  }
}
