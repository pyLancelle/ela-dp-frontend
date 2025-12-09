import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ActivityNotesCardProps {
  notes?: string;
}

export function ActivityNotesCard({ notes }: ActivityNotesCardProps) {


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Notes sur l'activité
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pt-0 px-6 pb-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notes}
        </p>
      </CardContent>
    </Card>
  );
}
