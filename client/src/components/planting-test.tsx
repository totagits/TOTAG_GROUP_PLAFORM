import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlantingTest() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Planting Module Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test component to verify rendering works correctly.</p>
        </CardContent>
      </Card>
    </div>
  );
}