# Local artifact repository

The meridiancare artifacts, so the fixture resolves without a registry:

    com/meridiancare/priorauth-clinical-rules/2.7.0    denial reasons as bare codes
    com/meridiancare/priorauth-clinical-rules/2.8.0    denial reasons as sentences
    com/meridiancare/priorauth-web-tokens/1.4.0

Both service poms declare this directory as a repository. junit and archunit are
still resolved from Maven Central the first time you build.

Without Maven you can put a jar on the classpath directly:

    javac -cp pipeline/local-m2/com/meridiancare/priorauth-clinical-rules/2.7.0/priorauth-clinical-rules-2.7.0.jar ...
