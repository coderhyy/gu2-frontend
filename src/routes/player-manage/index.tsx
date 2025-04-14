import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/player-manage/")({
  component: PlayerManagePage,
});

function PlayerManagePage() {
  const { data } = useQuery(getPlayersQueryOptions({ page: 1, size: 100 }));

  return (
    <div className="p-4">
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
}
