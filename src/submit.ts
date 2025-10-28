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
  weakestPillar: {
    name: string;
    score: number;
  };
  strongestPillar: {
    name: string;
    score: number;
  };
  questionsAndAnswers: Array<{ question: string; answer: string; pillar: string }>;
  lead: { name: string; email: string; whatsapp: string };
}) {
  try {
    const response = await fetch(
      "https://bothook.io/v1/public/triggers/webhooks/f1c99c63-a98a-4249-b4e2-82eb1e5090ac",
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
