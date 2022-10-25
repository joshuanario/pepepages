# Performance engineering web applications with load that is growing at a polynomial rate
Typically, a computer system's load grows as more users gain access to the system.  Eventually, a popular computer system will gain users at a fast rate (e.g. doubling every year) and will start to compound performance engineering issues.  The issues manifest itself as slower timing metrics (time-on-tasks, execution time, response time, first contentful paint, etc.), lower success rates in server requests and/or user interactions, and frequent failure modes.  In this lifecycle phase of the computer system, performance engineering must also scale up with the load.  In my experience, most product owners and technical leaders don't know how to formulate performance objectives for their computer systems.  The simplest benchmark I can think of is to maintain the current benchmark (timing metrics and success rates).  If there are observation and telemetry tools setup in production, there should be enough information on the operating range and states ("warm" states, "cold" states, data volume, etc.) of the computer system.  A benchmark's load generator infrastrucure should have "variabilization" that will explore the different possible state inputs for the load.  Also beware of reworking the computer system as they may introduce unavoidable performance degradations known as "performance deficits" that will require the vertical scaling or horizontal scaling of infrastructure to "payback the debt" in performance.  In addition, always check for memory leaks and CPU over-utilizations (and under-utilizations) with a soak test.

# Web Server Benchmark
Measures response time in milliseconds and success rate in percent.
## How-To
```mermaid
graph LR
    A[Request Factory] -- Generate Request --> B[Pulsewave Generator]
    B -- Report Stimulus and Output --> C(Waveform Monitor)
    B -- Generate Load --> D{Web Server}
    B -- Collect Measurement --> E(Measurement Store)
```
Figure: Load generator infrastructure for web server benchmarking
```mermaid
flowchart TD
    sp[[Response Validator]]
    db[(Measurements)]
    A[Start] --> B[Query measurements]
    B --> db
    db --> B
    B --> C[Compute response time characteristic curves]
    B --> D[Compute success rate characteristic curve]
    D --> sp
    sp --> D
    C --> E[Render and save results]
    D --> E
    E --> store
    store[(Benchmarks)]
```
Figure: Computer program for web server benchmark results rendering
1.  First, build the load generator infrastructure as illustrated.  Ensure that the request factory has high throughput, low latency, and more importantly variabilization that mirrors requests as seens in SIP  (system-in-production).  Ensure that the pulsewave generator has fast CPU, fast disk-writes, large memory, and high throughput.  More importantly, ensure the measured load generation is not off by no more than 50% from the rated load.  Also, the load generator only needs to report to the waveform monitor once every second for real-time viewing.  Lastly, the measurements are recorded (if configured) during load generation into the fast-writing disks, and then at the end of the load generation, the load generator stores all the measurements into the measurement store.  Make sure to have enough disk space.  The rule of thumb for disk space is: $$rated\_load * load\_test\_duration = disk\_space$$
Also, the disk should be fast within 3,000 IOPS on average or the average IOPS is at least three times the rated load.
1.  Second, create the computer program for the web server benchmark results rendering.  The computer program must produce the following results:
    - Response Time Characteristic Curve for each desired percintiles in the form of
    $$
    y = mx + b
    $$
    where $x$ is the load, and $y$ is the response time percentile.  If the $R^2$ is less thant 0.6, discard the results and rerun a new benchmark.
    - Success Rate Characteristice Curve in the form of 
    $$
    y =
    \left\{
        \begin{array}{ll}
            f - e^{gx-h} & x>x_{Maximum Safe Load} \\
            1.0 & x<=x_{Maximum Safe Load} \\
        \end{array} 
    \right.
    $$
     where $f > 1.0$, $g > 0$, $h > x_{Maximum Safe Load}$, $x$ is the load, and $y$ is the success rate as calculated by a response validator.  This characteristic curve is essentially like a filter response of a low pass filter where the MSL (maximum safe load) is the cut-off frequency.  If the response curve in the pass band is not continous with a 100% success rate, keep the results and rerun the benchmark until there are datapoints that show a continuous response curve in the passband.  If after three reruns and there is still no clear passband, stop running more benchmarks and assume that the SUT (system-under-test) has no passband.  If there are less than 100 datapoints within the passband, run the benchmarks again and again until there are over 100 datapoints within the passband.
1.  Operate the load generator to apply 1-minute pulsewave towards the SUT for at least 100 attack points throughout the operating range of the system (Lookup "one-in-ten" rule for predictive models).  However, before the pulsewaves are applied, apply a "warm-up load" to the SUT.  This load varies depending on the computer system as observed with SIP.  When in doubt, use a warm-up load of the highest rated load for a duration of 1 minute.  With that, there must be a cooldown duration between each pulsewave.  When in doubt, use a cooldown duration of 1 minute.
Make sure that the load applied is similar to the load applied to the SIP.  If the load in SIP hits multiple http endpoints simultaneously, then the load generator must hit multiple http endpoints simultaneaously.
1.  When the load generation is over and the measurements are collected, run the benchmark analysis computer program.
## Benchmark Comparison
Compute the residuals between the two web server benchmarks (See "residuals computation" below).
### Compare Response Time Benchmark
Use the equation $y=mx+b$ to get the fitted values (aka predicted values).  Get the residuals between the observed values and the fitted values.  Determine the performance difference based on the expected value of the residuals.
### Compare Success Rate Benchmark
Use the equation $y = 1.0$ to get the fitted values for $x<=x_{Maximum Safe Load}$.  Get the residuals between the observed values and the fitted values.  Determine the performance difference based on the expected value of the residuals.  Note that success rate characteristic outside of the passband is uncertain and is therefore considered to have low success rate.  The main thing to be concerned about in the success rate characteristic curve is that the $x_{Maximum Safe Load}$ is way beyond the operating range of the web server.

# Web Server Soak Test
Detects memory leaks, CPU over-utilization, and CPU under-utilization.
## How-To
1.  Build the load generator infrastructure.  The load generator used is the same one used in the benchmarking.
1.  Before operating the load generatore, ensure a measurement collector is actively collecting the CPU utilization and memory usages of the SUT for at least once every minute.
1.  Operate the load generator to apply a cold peak load on the SUT for 12 hours straight.  It is important that this load is applied on a constant level and uninterrupted.
1.  At the end of the load, run the memory leak detection and CPU utilization analysis.
### Memory Leak Detection
Once all the sampled memory consumption values are collected and sorted in chronological order, calculate the memory consumption rate function by computing the derivative function from the given array of time-stamped memory usage values.  A function in Python programming language, `diff`, from the package `numpy` is the recommended approach in calculating the derivative.  Each continuous interval with a positive value in the derivative function's plot is a single instance of a depletion state.  With the derivative function, compute the following for each depletion state instances:
-  Memory leak probability: count how many samples are found, $s$, within a depletion state instance and use the Laplace approach to the sunrise problem to compute the probability
$$
P = \frac{s + 1}{n + 2}
$$
where $n$ is the total count of samples in the whole soak test.  Note of any depletion state instances with probabilities greater 0.5 as that is a huge risk for a memory leak.
-  Average memory consumption rate: use the trapezoidal rule method in a computer program (like Python programming language) to compute the area under the curve of the derivative function within the duration of the depletion state instance, and then divide that value by the duration of the depletion state instance.  Main concern here is to make sure the computer system is not going to cause an OOM (out-of-memory event) within hours as opposed to days.  Generally speaking, this value should be low if there is proper memory management (like garbage collection) that it would take at least days to OOM the computing machine under the load.
### CPU Utilization Analysis
Once all the sampled CPU utilization values are collected, two hypothesis tests needs to be done on these values.  (See one sample hypothesis test below)
-  Under-utilization test:  Do a one sample hypothesis tests on the collected values where the target is 30%.  If the hypothesis tests proves that the collected values are most likely equal or below the target, then the system-under-test's CPU is under-utilized during the soak test.
-  Over-utilization test:  Do a one sample hypothesis tests on the collected values where the target is 70%.  If the computer system is not sensitive to latencies, then setting the target to 80% is a sound judgement.  If the hypothesis tests proves that the collected values are most likely equal or above the target, then the system-under-test's CPU is over-utilized during the soak test.
(See queueing theory below to understand CPU utilization analysis in great details.)
# Webpage Benchmark
//todo, FCP, LCP, FMP, TTI, TTFB, JSExecTime

# User Interaction Benchmark
//todo 

# Performance Objectives
In my experience, it is very important to formulate performance objectives before running any load generators and benchmarks in order to remove subjectivity and confirmation bias.   This also adds goals for the performance engineers and computer system engineers to work towards.  For performance engineers, performance engineers makes designing experiments easier because the performance objectives becomes the basis of the hypothesis for an experiment.  Another thing I have personally seen is product owners not knowing how to formulate a proper performance objective and would literally state "The web service just has to work." as the word-for-word performance objective.  Product owners unguided by technical leadership are bound to fail in accomplishing any engineering objective, which includes performance objectives.
# Fundamentals 1/3: Inferential Statistics
In Pierre-Simon Laplace's published work *Essai philosophique sur les probabilités*, he wrote something titled "Princple VI" that would lay down the foundation to inductive probabilities, which I personally used heavily in performance engineering any computer systems for reliability and usability.  Thomas Bayes' theorem is also a must know.  The main idea is: collecting diverse performance datapoints from a commputer system under simulated load will provide insight on how the computer system will perform under real-world traffic.  Also, hypothesis testing and residual computations can give insights on benchmark comparisons.  By using statistical analysis and forcing performance engineers to design experiments, subjectivity and confirmation bias is removed from the analytical results.  I have personally seen engineers rerun benchmarks because it did not meet their expected results.  I have seen engineering teams run benchmarks with no hypothesis in mind, and then subsequently author a hypothesis after the benchmark results are printed.  I have met engineers that confidently accepted statistical analysis results from just one performance datapoint.  I'm guessing these engineers never heard of central limit theorem.  I call them gambling engineers.  They are either ignorant of statistical concepts or they choose to not apply any statistics to their engineering efforts.  In the end, I always witnessed the eventual results of their gambled engineering, which is the frequent failure modes of their computer systems.
# Fundamentals 2/3: Performance Engineering Team
The team should be composed of :
1.  Data Scientist: This role should be filled by a competent statistician who can identify dependent and independent random variables in an experiment or benchmark.  This person ensures that every experiments and benchmarks are free of biases and are mathematically sound.
1.  Load Generator Operator:  This role should be filled by a capable server administrator who can build the computer system (the SUT) from the ground up and install different softwares like load generators and analytical computation softwares.  This person's goal is to use a load generator to run benchmarks on SUT, collect its performance datapoints, and conduct experiments.
1.  Application Performance Monitor:  This role should be filled by a capable server administrator who can install monitoring tools and telemetry software on the computer system (the SIP).  This person's goal is to collect enough performance datapoints from the SIP in order to run experiments and benchmark comparisons.  This person should also know operating range, load growth trends, and states of the computer system that will dictate some of the parameters of the benchmarks or experiments.
1.  Software Engineer: This role should be filled by a skilled computer programmer that can develop different computer applications such as load generators, performance measurement collectors, analytical computation programs, and analysis report viewer.  Ideally, this role can build and operate the software on a cronjob (or any scheduling tool) as requested by other performance engineers.
# Fundamentals 3/3: Statistical Analysis Standard
1.  Never use any statistical analysis that has a confidence level lower than 95%.
1.  Linear regressions must have a coefficient of determination, $R^2$, greater than 0.6 to be considered an acceptable predictive model.  Collect more datapoints in order to achieve this value.  I recommend collecting datapoints from 100 attack points as a starting point even though the *one-in-ten* rule states that 10 is a good starting point.
1.  Hypothesis tests must use an alpha threshold of no more than 0.05, which relates to a confidence level of 95%.
1.  Datasets used in a hypothesis tests must be at least 100 in sample size.
1.  Sample sizes of two datasets for a single two-sample hypothesis test must not be unequal by over 25% of the larger sample size.

# Useful and Common Hypothesis Tests
Hypothesis tests are useful in conducting experiments proving whether the SUT is operating within the performance objectives.  These flowcharts outlines the most common hypothesis tests that I run into.
## One Sample
Generally, it's a choice between Student's t-test and Wilcoxon's signed-rank test.
The following are commonly computed:
-  Sample size
-  Sample's mean
-  Sample's standard deviation
-  Sample's median
-  Difference between target and sample's mean
-  Difference between target and sample's median
```mermaid
flowchart TD
    A[Start with a sample and a target] --> x{Degenerate?}
    x --> B{D'Agostino K^2}
    B --> C{Student-t}
    B --> D{Wilcoxon's signed-rank}
    C --> E[Below target]
    C --> F[On target]
    C --> G[Above target]
    D --> E
    D --> F
    D --> G
    x --> sp[[Degenerate Distribution Handler]]
```
Figure: Computer program for one-sample hypothesis test
Here are the Python functions that I used for these test:
1.  D'Agostino $K^2$: `scipy.stats.normaltest`
1.  Student-t: `scipy.stats.ttest_1samp`
1.  Wilcoxon's signed-rank: `scipy.stats.wilcoxon`
## Two Sample
Generally, it's a choice between Student's t-test and Mann-Whitney U-test.  I really like Student's work in statistics.  I'm not a big fan of Welch's t-test, so I covered for Student's homogeneity requirement with Levene's test.  Note that we are treating these samples (assuming these are benchmarks) as unpaired samples (aka independent).
The following are commonly computed:
-  Sample size of a and 
-  Mean of a and b
-  Standard deviation of a and b
-  Median of a and b
-  Difference between the means of a and b
-  Difference between the medians of a and b
```mermaid
flowchart TD
    A[Start with a and b] --> x{Degenerate?}
    x --> B{D'Agostino K^2}
    B --> D{Mann-Whitney-U}
    B --> H{Levene}    
    H --> C{Student-t}
    C --> E[a < b]
    C --> F[a = b]
    C --> G[a > b]
    H --> D
    D --> E
    D --> F
    D --> G
    x --> sp[[Degenerate Distribution Handler]]
```
Figure: Computer program for one-sample unpaired hypothesis test
Here are the Python functions that I used for these test:
1.  D'Agostino $K^2$: `scipy.stats.normaltest`
1.  Levene: `scipy.stats.levene`
1.  Student-t: `scipy.stats.ttest_ind`
1.  Mann-Whiney-U: `scipy.stats.mannwhitneyu`
## Degenerate Distributions
Sometimes, there are distributions in these experiments, especially in any experiment involving caches or any sort of performance optimization.  These degenerate distributions will break hypothesis tests that are stated above.  A degenerate distribution can be easily identified with a near-zero standard deviation and near-zero variance.  One time, I received a degenerate distribution of database execution times that had standard deviations in the hundreds of nanoseconds.  However, the stopwatch used in the database benchmarking was only accurate in the microseconds, so I deemed the distribution to be degenerate.  Another way to identify degenerate distributions is through visually inspecting the histogram.  If the histogram resembles that of a Dirac delta function, then it is most likely a degenerate distribution.  The way to handle a degenerate distribution is to treat it as a deterministic scalar value using its mean.  So in a one sample hypothesis test, it's just a matter of equality comparison between the degenerate distribution's mean and the target value.  In a two sample hypothesis test, if only one dataset is degenerate, then just run the test as a one sample hypothesis test using the degenerate distribution's mean as the target.
## Bimodal Distributions
Another common distribution in performance engineering is bimodal distribution, which is also common in experiments involving caches or any sort of performance optimization.  This distribution can be visually identified in a histogram.  If a histogram has two humps (aka "modes"), then that's a bimodal distribution.  One hump is the unoptimized datapoints (or uncached datapoints) while the other hump is the optimized datapoints (or cached datapoints).  Bimodal distributions don't necessarily break hypothesis tests, but they don't pass the normality requirement of a Student's t-test.  So, nonparametric hypothesis tests, like Wilcoxon's signed-rank test and Mann-Whitney U-test, will do a good job of doing hypothesis tests on the distributions' median since the distribution's mean holds no significant value.  Just always use D'Agostino $K^2$ test to determine if a nonparametric test will be used.

# Residual Computations
A residual is the "error" computed between the observed value and the fitted value like:
$$ residual = observed\_value - fitted\_value $$
The fitted value is computed from the predictive model, which in our case are the lines of best fits (aka characteristic curves) generated from the benchmarks.  The independent variable, $x$, is taken from the observed values.  What are the fitted values and observed values vary on the task.  If the task is assessing the correctness of the predictive model generated from benchmarking the SUT, then the observed values would come from the SIP with the similar build as the benchmarked SUT.  If the task is comparing the benchmarks between the two builds of a computer system, then it's a comparison of the old build's observed values (raw measurements from the benchmarks) against the characteristic curves of the new build.  Good lines of best fits have coefficients of determination, $R^2$, greater than 0.6.  There is no best way to ensure good $R^2$ aside from the *one-in-ten* rule, which in our case mean that we would have a minimum 10 attack points for our benchmark.  However, I propose having 100 attack points minimum for a single benchmark.
## Residual Analysis for Benchmark Comparison
The residuals' satisfaction the conditions of the Gauss-Markov Theorem determines how we analyze the benchmark comparison.  Those conditions are:
1.  $ Cov(r_{i}, r_{j}) = 0, \forall i \neq j$: This condition is a strict requirement.  There must be no correlation among the residuals.  If this condition is not met, then the benchmark comparison is inconclusive.  There a naive algorithm to compute the covariance matrix.  In the Python programming language, there is a package called `numpy` with a function called `cov`, which uses the naive algorithm to compute the covariance matrix. Then, do a one-sample hypothesis test where the target is zero and the samples are the entries outside of the main diagonal of the covariance matrix.  (See one sample hypothesis test.)
1.  For all $i$, $ Var(r_{i}) = \sigma^{2} \lt \infty $.  This condition is also a must.  This is the homoscedasticity requirement, or finite variance requirement.  If this requirement is not met, then the benchmark comparison is inconclusive.  The numerical way to test this is using Breusch–Pagan test.  In the Python programming language, there is a package called `statsmodels.stats.diagnostic` with a function called `het_breuschpagan`, which will do a hypothesis test for homodasticity using Breusch–Pagan test.
1.  $ E[r] = k $: If $k$ is zero, then there is no difference in the benchmarks. Or, there is no anticipated performance impact between the two builds of the computer systems.  Else, there is a difference between the benchmarks.  A negative expected value of residuals means the fitted values are generally have a higher value than the observed values.  A positive expected value of residuals means that the observed values are generally larger values from the fitted values.  Note, the Markov amendment to Gauss' original theorem removed the normality requirement so running a D'Agostino $K^2$ test on the residuals is not needed.  In the Python programming language, there is a package called `numpy` with a function called `mean`, which calculates the mean (aka the expected value).

# Timing Metrics
Use of percentiles is preferred in measuring timing metrics with 50th, 95th, and 99th commonly used.  Note that P50 is similar to the average of the timing metric, but conceptually they are not the same.  Most people may use averages because it is way easier to compute than percentiles.  For extremely large populations (like the whole planet) or a population where laggards are expected (like rural communities with slow network connections or poor populations who cannot afford latest models of computing devices), the 75th percentile is used and any larger percentile is ignored.
## Human-behavior-driven timing thresholds
There are three notable timing thresholds to know stated from human behavior research:
1.  400ms as defined by Doherty's Threshold.  Ideally, the computer system should respond within this threshold to every user interaction in order to increase productivity (and user satisfaction).  If the computer system cannot respond with the requested value within this threshold, the computer system should borrow patience from the user with a screen text asking for patience and rendering an animated screen.
1.  2,000ms as dictated by research on human patience with computer systems.  This value may fluctuate with the journey map.  A journey map with more user stress (like a user of a medical software where life and limb is on the line) may have a lower patience threshold.  Users have a tendency to do undesirable things when they become impatient (like spam inputs, forced reset/shutdown of application, lose conversion, lose lead, leave negative review of the product, etc.).  A strategy to deal with impatience is to keep switching the screen text and the animation in the screen in order to show the user that the application did not freeze.  Progress bars with percent completed are a great way to keep borrowing patience from users even though the computer task is way beyond this threshold.
1.  10,000ms as dictated by research on human short attention span.  Any task that takes longer than this should run in a queue in the background so that the user can keep using the application.  This ideally should have a notification system that notifies the user when the background task completed or encountered an error.  This threshold should be treated as the maximum amount of time an animated screen with text can keep borrowing patience from users.  Any screen text asking for patience, progress bars, spinners, etc. that goes longer than this threshold runs the risk of losing the user's attention.

# TCP slow start
Understanding TCP congestion control (aka slow-start) is critical in performance tuning modern webapps.  Imagine an algorithm trying to send a file down a transport channel without knowing its file size.  The algorithm starts with a small chunk of the file, and then doubles the size of the next chunk to be sent if the previous file was sent successfully.  Slow-start is not a concern for streaming of large data as the data transport would have optimized within the early phase of the data transport.  Slow start is a main concern for bursty data transfers like the download of web assets, and speed of the network is not a great remedy in overcoming the speed degradation that comes with slow-start.  The best way to reduce the speed degradation caused by slow-start is to lower the file size.  Decreasing the file size drastically reduces the number of round-trips.  Nowadays, javascript app builders (like `webpack`) will even raise a warning when the build output is over **244 kilobytes** and is capable of disassembly of large web assets into smaller pieces with the hopes of assembly during page loads in the browser's runtime.  Some webpage benchmarking tools like Google Chrome's `lighthouse` will raise a warning if the content is not compressed (using a compression algorithm like `gzip`).

# Queueing Theory
Amdahl's Law and Gustafson's law essentially dictates that a properly utilized computing machine should have CPU utilizations between 30% and 70% when processing a long queue of multiple computer task requests.  Computer systems that can tolerate latencies can operate as high up as 80% CPU utilization.  An under-utilized CPU means that the computing machine's performance specification is an over-kill for the load that it was tested, which is a main concern for financial reasons.
| CPU Utilization | Queue time | Latency |
| --- | --- | --- |
| $ U \lt 30\%$ | None | Optimal |
| $ 70\% \ge U \ge 30\%$ | Short | Optimal |
| $ U \gt 70\%$ | Long | Excessive |
| $ U \gt 80\%$ | Extremely Long | Very Excessive |