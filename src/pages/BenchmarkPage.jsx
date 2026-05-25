import React from 'react';
import Benchmark from '../components/Benchmark';
import Metrics from '../components/Metrics';
import Charts from '../components/Charts';
import Export from '../components/Export';

export default function BenchmarkPage() {
  return (
    <div className="page">
      <Benchmark />
      <Metrics />
      <Charts />
      <Export />
    </div>
  );
}
