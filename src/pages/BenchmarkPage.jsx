import React from 'react';
import Benchmark from '../components/Benchmark';
import Metrics from '../components/Metrics';

export default function BenchmarkPage() {
  return (
    <div className="page">
      <Benchmark />
      <Metrics />
    </div>
  );
}
