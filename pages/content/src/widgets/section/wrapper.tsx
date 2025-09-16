import zIndex from '@src/utils/zindex';

export interface IProps {
  active: boolean;
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { active, children } = props;

  return (
    <div
      tabIndex={-1}
      role="presentation"
      className="absolute inset-0 select-none"
      style={{
        zIndex: zIndex(),
        cursor: active
          ? "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDJIMThWNyIgc3Ryb2tlPSIjMkM0NkYxIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTcgMkgyVjciIHN0cm9rZT0iIzJDNDZGMSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMyAxOEgxOFYxMyIgc3Ryb2tlPSIjMkM0NkYxIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTcgMThIMlYxMyIgc3Ryb2tlPSIjMkM0NkYxIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==') 10 10, auto"
          : 'default',
      }}>
      {children}
    </div>
  );
}
