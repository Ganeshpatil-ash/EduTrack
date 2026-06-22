import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from './Card.jsx';
import { cn } from '../../lib/utils';

const ChartContainer = ({ title, subtitle, action, children, className, height = 280 }) => (
  <Card className={cn('flex flex-col', className)}>
    <CardHeader className="pb-0">
      <div>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </CardHeader>
    <CardBody style={{ height }} className="pt-3">
      {children}
    </CardBody>
  </Card>
);

export default ChartContainer;
