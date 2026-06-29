import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, type Lead } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Search, ArrowUpDown, Trash2 } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; variant: "new" | "in_progress" | "completed" }> = {
  new: { label: "Новая", variant: "new" },
  in_progress: { label: "В работе", variant: "in_progress" },
  completed: { label: "Завершена", variant: "completed" },
};

const CLEANING_MAP: Record<string, string> = {
  maintain: "Поддерживающая",
  general: "Генеральная",
  post_repair: "После ремонта",
  post_move: "После переезда",
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchLeads = useCallback(async () => {
    const data = await api.getLeads({ search, status: statusFilter, sort: sortField, order: sortOrder });
    setLeads(data);
  }, [search, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id: number, status: string) => {
    await api.updateLeadStatus(id, status);
    fetchLeads();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    await api.deleteLead(id);
    fetchLeads();
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="text-sm text-muted-foreground mt-1">{leads.length} заявок</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, телефону, Telegram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-primary">
                      Имя <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">Телефон</th>
                  <th className="text-left p-4 font-medium">Услуга</th>
                  <th className="text-left p-4 font-medium">
                    <button onClick={() => toggleSort("area")} className="flex items-center gap-1 hover:text-primary">
                      Площадь <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">
                    <button onClick={() => toggleSort("priceMin")} className="flex items-center gap-1 hover:text-primary">
                      Стоимость <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">
                    <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 hover:text-primary">
                      Дата <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">Статус</th>
                  <th className="text-right p-4 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{lead.name}</div>
                      {(lead.whatsapp || lead.telegram) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {lead.whatsapp && <span>WA: {lead.whatsapp}</span>}
                          {lead.whatsapp && lead.telegram && <span> · </span>}
                          {lead.telegram && <span>TG: {lead.telegram}</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-4">{lead.phone}</td>
                    <td className="p-4">
                      <div>{CLEANING_MAP[lead.cleaningType] || lead.cleaningType}</div>
                      <div className="text-xs text-muted-foreground">{lead.objectType === "apartment" ? "Квартира" : lead.objectType === "house" ? "Дом" : "Офис"}</div>
                    </td>
                    <td className="p-4">{lead.area} м²</td>
                    <td className="p-4 font-medium">{formatPrice(lead.priceMin)} — {formatPrice(lead.priceMax)}</td>
                    <td className="p-4">
                      <div>{new Date(lead.createdAt).toLocaleDateString("ru-RU")}</div>
                      <div className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td className="p-4">
                      <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge variant={STATUS_MAP[lead.status]?.variant || "secondary"}>
                              {STATUS_MAP[lead.status]?.label || lead.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="in_progress">В работе</SelectItem>
                          <SelectItem value="completed">Завершена</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">Заявок пока нет</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
