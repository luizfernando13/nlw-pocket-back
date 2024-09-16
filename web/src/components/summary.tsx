import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { PendingGoals } from './pending-goals'
import { EmptyGoals } from './empty-goals'
import { WithCompletion } from './with-completion'

dayjs.locale(ptBR)

export function Summary() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Ocorreu um erro: {error.message}</p>;
  }

  const firstDayOfWeek = dayjs().startOf('week').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('D MMM')

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4"></Plus>
            Cadastrar Meta
          </Button>
        </DialogTrigger>
      </div>

      <Separator />

      {/* Renderiza as metas pendentes ou, se existir, os dados completos */}
      {!data || data.goalsPerDay === null ? (
        <>
        <PendingGoals />
        <h2 className='font-serif text-[17px]'>Vocé não completou nenhuma meta nesta semana ainda! </h2>
        </>
      ) : (
        <WithCompletion data={data} queryClient={queryClient} />
      )}
    </div>
  )
}
