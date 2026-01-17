import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export function AuthRequired() {
    return (
        <div className="flex h-full w-full items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <LogIn className="h-8 w-8" />
                    </div>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>
                        Please sign in to access your dashboard and log signal data.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
